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
  claim: (sid) => `{cw}:claim:${sid}`,
  mobile: (hash) => `{cw}:mob:${hash}`,
  audit: "{cw}:audit",
};

export const SESSION_TTL_SEC = 60 * 60 * 24; // 24h — long enough for slow funnels
export const CLAIM_TTL_SEC = 60 * 60 * 24 * 7; // 7d — idempotency horizon
export const AUDIT_MAX = 200;

/**
 * Pick the unclaimed session whose anchor is closest to the expected lag before
 * the reference instant, and claim it — atomically, in one round trip.
 *
 * Atomicity matters: two leads submitted within the same second must never be
 * handed the same session. Doing the select and the claim in Lua removes the
 * read-then-write race entirely, so no optimistic retry loop is needed.
 *
 * KEYS[1] = {cw}:anchor
 * ARGV    = loMs, hiMs, refMs, expectedLagMs, mobileHash, claimTtlSec
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
  if redis.call('EXISTS', '{cw}:claim:' .. sid) == 0 then
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
end
if not best then
  return { '', '0', tostring(#ids), {} }
end
redis.call('SET', '{cw}:claim:' .. best, ARGV[5], 'EX', tonumber(ARGV[6]))
return { best, tostring(bestLag), tostring(#ids), redis.call('HGETALL', '{cw}:s:' .. best) }
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
