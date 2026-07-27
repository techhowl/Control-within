import Redis from "ioredis";

/**
 * Server-only Valkey (Redis-protocol) client for the UTM attribution store.
 *
 * Mirrors src/lib/supabase.js: lazy, module-cached, and throws a clear error if
 * VALKEY_URL is missing rather than failing cryptically. Dokploy runs a
 * long-lived Node process, so the single connection is pooled across requests.
 *
 * Env (.env):
 *   VALKEY_URL   rediss://default:<password>@<host>:<port>   (required)
 *
 * `rediss://` turns on TLS automatically. Aiven serves a publicly-trusted cert,
 * so no CA bundle is needed.
 */

// Every key carries the {cw} hash tag so the Lua script below stays inside a
// single slot if this ever runs against a clustered Valkey.
export const K = {
  session: (sid) => `{cw}:s:${sid}`,
  anchor: "{cw}:anchor",
  mobile: (hash) => `{cw}:mob:${hash}`,
  audit: "{cw}:audit",
};

export const SESSION_TTL_SEC = 60 * 60 * 24; // 24h — long enough for slow funnels
export const IDEMPOTENCY_TTL_SEC = 60 * 60 * 24 * 7; // 7d — Interakt retry horizon
export const AUDIT_MAX = 200;

/**
 * Pick the session whose anchor is closest to the expected lag before the
 * reference instant, hand back its data, and CONSUME it — atomically, in one
 * round trip.
 *
 * Consuming means the hash is deleted and the member removed from the anchor
 * set, so a session is usable exactly once. Atomicity matters: two leads
 * submitted within the same second must never be handed the same session, and
 * doing select + delete in Lua removes the read-then-write race entirely.
 *
 * If the CRM write later fails, the caller puts the session back with
 * restoreSession() — it still holds the data returned here.
 *
 * KEYS[1] = {cw}:anchor
 * ARGV    = loMs, hiMs, refMs, expectedLagMs
 * Returns { sid, lagMs, candidateCount, hgetallFlatArray }
 *          sid is "" when nothing matched (candidateCount still reported).
 */
const CLAIM_LUA = `
local ids = redis.call('ZRANGEBYSCORE', KEYS[1], ARGV[1], ARGV[2])
local ref = tonumber(ARGV[3])
local expected = tonumber(ARGV[4])
local best, bestDelta, bestLag
for i = 1, #ids do
  local sid = ids[i]
  local score = redis.call('ZSCORE', KEYS[1], sid)
  if score then
    local lag = ref - tonumber(score)
    local delta = math.abs(lag - expected)
    if (not bestDelta) or delta < bestDelta then
      best = sid
      bestDelta = delta
      bestLag = lag
    end
  end
end
if not best then
  return { '', '0', tostring(#ids), {} }
end
local data = redis.call('HGETALL', '{cw}:s:' .. best)
redis.call('DEL', '{cw}:s:' .. best)
redis.call('ZREM', KEYS[1], best)
return { best, tostring(bestLag), tostring(#ids), data }
`;

let client = null;

export function getValkey() {
  if (client) return client;

  const url = process.env.VALKEY_URL;
  if (!url) {
    throw new Error(
      "Valkey is not configured. Set VALKEY_URL in .env (see .env.example)."
    );
  }

  client = new Redis(url, {
    connectTimeout: 5000,
    // Bounded latency instead of a disabled offline queue. Turning the queue
    // off drops the first command of the process, because the TLS handshake is
    // still in flight when it arrives; queueing plus a hard command timeout
    // gives the same fail-fast behaviour without losing that first write.
    commandTimeout: 3000,
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

  // Without a listener, a connection blip raises an unhandled 'error' event and
  // takes the Node process down. Log and carry on — callers handle failure.
  client.on("error", (err) => {
    console.error("valkey_error:", err.message);
  });

  // EVALSHA-cached by ioredis, so the script body travels the wire once.
  client.defineCommand("attrClaim", { numberOfKeys: 1, lua: CLAIM_LUA });

  return client;
}
