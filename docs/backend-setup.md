# Backend setup — journey tracking

This is the **testable core** of the Control Within backend: a journey-tracking
service backed by Supabase (PostgreSQL). It works standalone — no Interakt or
Zoho account needed. Those are Phase 2.

## What it does

Every visitor gets a `journey_id` (UUID) and an 8-char `short_ref` on first
touch, persisted in an httpOnly cookie. Events are logged against the journey.
When the visitor clicks the WhatsApp CTA, we build a `wa.me` link with the
`short_ref` embedded in `[brackets]` so the conversation can later be stitched
to the journey in Interakt/Zoho.

## Routes

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/api/journey/init` | Create or resume a journey, set the cookie. Body (all optional): `entry_path, profile_hint, age_band, gender, utm_source, utm_medium, utm_creative`. → `{ journey_id, short_ref, resumed }` |
| POST | `/api/journey/event` | Log an event. Body: `{ event_type, metadata? }`. Valid types: `page_view, module_view, cta_click, clinic_locator_click, repeat_visit, path_merge`. |
| GET | `/api/whatsapp/handoff` | Build the `wa.me` link. Query: `consent=1` (stamp consent), `redirect=1` (302 to WhatsApp). → `{ url, short_ref }` |
| POST | `/api/journey/erase` | DPDP erasure — hard-delete the journey (events cascade) and clear the cookie. |

## One-time setup

### 1. Create a Supabase project

1. Go to <https://supabase.com> → sign in → **New project**.
2. Pick a name, a strong DB password, and the region closest to your users
   (e.g. Mumbai / `ap-south-1` for India). Wait ~2 min for it to provision.

### 2. Run the schema

1. In the Supabase dashboard: **SQL Editor → New query**.
2. Paste the contents of [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql)
   and click **Run**. This creates the `journeys` and `journey_events` tables,
   indexes, and enables RLS.

### 3. Grab your keys

In **Project Settings**:

- **Data API → Project URL** → `SUPABASE_URL`
- **API Keys → `service_role`** (the secret one) → `SUPABASE_SERVICE_ROLE_KEY`

> The service_role key bypasses RLS. It is used **only** server-side in route
> handlers and must never reach the browser. Never prefix it with `NEXT_PUBLIC_`.

### 4. Configure env

```bash
cp .env.example .env.local
```

Fill in:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
WHATSAPP_NUMBER=919999999999      # your WhatsApp Business number, digits only
```

Restart `npm run dev` after editing `.env.local`.

## Test it (PowerShell)

```powershell
# 1. Init a journey (saves the cookie to a jar)
$r = Invoke-RestMethod -Uri http://localhost:3000/api/journey/init -Method Post `
  -ContentType 'application/json' `
  -Body '{"entry_path":"/","utm_source":"test"}' -SessionVariable s
$r   # -> journey_id, short_ref, resumed:false

# 2. Log an event (reuses the cookie)
Invoke-RestMethod -Uri http://localhost:3000/api/journey/event -Method Post `
  -ContentType 'application/json' `
  -Body '{"event_type":"cta_click","metadata":{"button":"hero"}}' -WebSession $s

# 3. Build the WhatsApp handoff link
Invoke-RestMethod -Uri "http://localhost:3000/api/whatsapp/handoff?consent=1" -WebSession $s

# 4. Erase (DPDP) — deletes the journey + all its events
Invoke-RestMethod -Uri http://localhost:3000/api/journey/erase -Method Post -WebSession $s
```

Then check **Table Editor → journeys / journey_events** in Supabase to see the
rows appear and disappear.

## UTM attribution (Valkey + Interakt → Zoho)

Campaign params live in the landing URL, the visitor then leaves for WhatsApp,
and WhatsApp carries nothing forward. Interakt's webhook knows the phone number
and when the contact was created, but nothing about the ad. The two are bridged
by timestamp proximity, using a Valkey session store:

```
land ?utm_…     POST /api/attribution/session {event:"land"}      store params, anchor = server now
tap WhatsApp    sendBeacon           {event:"wa_click"}           anchor moves to the click  ← the signal
user sends "Hi" Interakt creates the contact                      → Created_at
form submitted  Zoho Flow node creates the Lead
                POST /api/attribution/claim {mobile, Created_at}  match, then patch the Lead
```

This is a heuristic, not a guarantee. It is wrong only when two visitors overlap
inside the matching window, and an unmatched claim writes the neutral `Whatsapp`
placeholder set rather than inventing data.

### Prefilled WhatsApp message

The one piece of attribution that *does* survive the jump: the counsellor sees
where the person came from before anyone types. Built at click time in
`src/lib/campaign.js` from two things — the channel, and `utm_method`
(`implant` | `hiUS`, matched case-insensitively).

| channel signal in the URL | message |
| ------------------------- | ------- |
| `platform=meta`, `utm_medium=paid_social`, or `fb`/`ig`/`facebook`/`instagram`/`messenger`/`meta` in **either** `utm_source` or `utm_medium` | Hi, I saw your ad on META and would like to know more about **{method}**. |
| `google`/`paid_search`/`adwords`/`google_ads`/`googleads`/`gads` in **either** `utm_source` or `utm_medium` | Hi, I saw your ad on Google and would like to know more about **{method}**. |
| `src=qr…`/`utm_medium=scan` + `utm_source=chemist` | Hi, I scanned the QR code at the chemist and would like to know more about **{method}**. |
| `src=qr…`/`utm_medium=scan` + `utm_source=clinic` | Hi, I scanned the QR code at the clinic and would like to know more about **{method}**. |

`{method}` renders as `Implant` or `hIUS`. Meta paid traffic is detected on
`platform=meta`, because `{{site_source_name}}` resolves to `fb`/`ig`/`msg` and
never the string `meta`. Hand-built links (bio links, offline QR sheets) name the
network in whichever slot the author picked — `utm_source=offline&utm_medium=instagram`
is a real example — so `utm_source` and `utm_medium` are both checked against the
network list. Note the wording says "ad" either way. Google is treated the same:
`utm_medium=google` with no `utm_source` at all is a real link and counts.

**Unexpanded ad macros are dropped, not stored.** A value that is entirely braces
and a token — Google ValueTrack `{keyword}` / `{campaignid}`, Meta
`{{campaign.name}}`, or their `%7Bkeyword%7D` encoding — is rejected by `clean()`,
so a broken tracking template leaves `UTM_Term` empty rather than filling the CRM
with the literal `{keyword}`. A brace *inside* a longer value is left alone.

Every WhatsApp surface goes through `<WhatsAppButton/>` — the desktop and mobile
"Chat Now", the mobile floating icon, the Hero CTA, the method cards, the footer
link and the `/ius` + `/implant` section CTAs — so all of them behave the same.

Message, in order:

1. The **campaign message**, whenever the params yield a channel *and* a method.
   It outranks a `message` prop: that prop only names a method ("…about hIUS")
   while this names the method *and* the channel.
2. Otherwise the `message` prop, which is what organic visitors on `/ius` and
   `/implant` see. Unchanged wording.
3. Otherwise `Hi, I would like to know more information.` Channel without method,
   or method without channel, lands here — no half-built sentence is ever sent.

**Method**, most specific first — where the visitor is *now* beats the ad that
brought them, because `utm_method` records what was advertised, not what they
chose:

1. A `method` prop, for a button that speaks for one method (a method card CTA).
2. The path — `/implant`, `/ius`.
3. `utm_method`, the fallback on shared pages like `/`.

So an Implant ad → visitor browses to `/ius` → taps any chat button sends
"Hi, I saw your ad on META and would like to know more about **hIUS**." The
channel stays from the campaign; the method follows the visitor.

Landing params are cached in `localStorage.cw_utm`, so the message still works
after the visitor clicks through to another page and the query string is gone.
Arriving on a new campaign URL overwrites it; an organic page view does not.

`utm_method` is stored on the session but **not** written to Zoho — there is no
`UTM_Method` field in the CRM, and an unknown field name fails the whole update.
Add the field, then add the mapping in `sessionToZohoFields`.

### Routes

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/api/attribution/session` | Browser ping. Body: `{ session_id, event: "land"\|"wa_click", utm_*` (incl. `utm_method`)`, placement, platform, src, entry_path }`. Always 204, even when Valkey is down. |
| POST | `/api/attribution/claim` | Interakt webhook. Header `x-api-key: <ATTRIBUTION_API_KEY>`. Body: `{ mobile, Created_at }`. Matches a session and patches the Lead. Flat JSON response. |
| GET | `/api/attribution/debug?key=…` | Last 50 claim outcomes + live session count + the active window config. Use it to tune the lag settings. |

### Interakt setup

Add a **Trigger a Webhook** node **after** the existing Zoho Flow node — running
before it means there is no Lead to patch yet (the retry backoff is a safety
net, not a substitute):

- POST `https://controlwithin.com/api/attribution/claim`
- Headers: `Content-Type: application/json`, `x-api-key: <ATTRIBUTION_API_KEY>`
- Body: `{ "mobile": "{{6}}", "Created_at": "<contact created_at variable>" }`

`Created_at` is parsed leniently: ISO-8601, `YYYY-MM-DD HH:mm:ss` (read as UTC),
epoch seconds, epoch milliseconds. An unresolved `{{…}}` placeholder is ignored
rather than treated as a date.

### Write rules

- **`UTM_Source` is never touched.** Not created, not updated, matched or not —
  the WhatsApp phrase system owns that field. It is still reported in the
  response so you can see what the matched session carried.
- **Values are percent-decoded.** A campaign name pasted into Meta Ads already
  encoded (`Control%20Within%20|%20July`) survives the browser's own decode and
  would reach Zoho with the `%20`s intact. `clean()` decodes up to twice (so
  `%2520` also resolves) and collapses whitespace, on capture *and* on read — so
  sessions already stored with `%20` come out clean too.
- **Matched session → last touch wins.** Of the remaining fields, a matched
  session's values are written even over an existing value. Without this a
  contact who comes back through a *later* campaign keeps their first campaign
  forever — the Lead already exists with every UTM field filled, so the new
  campaign's spend would attribute to nothing. The overwritten field names come
  back in `fields_overwritten`.
- **No match → fill-if-blank.** The neutral placeholder set
  (`UTM_Medium/Platform = Whatsapp`, `UTM_Campaign = Connexi * Howl`,
  env-overridable) only ever fills empty fields, so it can never clobber a real
  campaign value. Every Lead still ends up carrying campaign context.
- **A no-op is reported, not hidden.** Nothing written comes back as
  `already_current` (the Lead already carries exactly this campaign),
  `already_filled` (unmatched, so we refused to touch a populated field) or
  `nothing_to_write` (the session only carried fields this route may not write).
- **Idempotent.** The outcome is cached per mobile for 7 days, so Interakt
  retries cost nothing. A failed CRM write is *not* cached and stays retryable.
  Note the flip side: a contact who returns through a new campaign **within**
  those 7 days hits the cache before the matcher runs, so that visit is not
  re-attributed. Re-attribution starts working once the cache entry expires.
  Shorten `IDEMPOTENCY_TTL_SEC` in `src/lib/valkey.js` if same-week
  re-attribution matters more than a long retry horizon.

### Matching windows

`Created_at` is when the contact was created on WhatsApp — for a first-time
messager that is seconds after the WhatsApp tap, which makes it a tight anchor.
A returning contact carries an old `Created_at`, so anything older than
`ATTR_STALE_SEC` falls back to anchoring on API arrival time with a wider window.

| profile | window before the anchor | expected lag |
| ------- | ------------------------ | ------------ |
| `created_at` | `ATTR_CREATED_MAX_LAG_SEC` (600s) | `ATTR_CREATED_EXPECTED_LAG_SEC` (25s) |
| `arrival` | `ATTR_ARRIVAL_MIN/MAX_LAG_SEC` (10–420s) | `ATTR_ARRIVAL_EXPECTED_LAG_SEC` (70s) |

Compare real `lag_sec` values in `/api/attribution/debug` and retune the
expected-lag values in `.env` — no code change needed.

### Valkey keys

All prefixed with a `{cw}` hash tag so the Lua matcher stays single-slot if the
instance ever becomes a cluster. Nothing needs provisioning; TTLs clean up.

| key | type | TTL |
| --- | ---- | --- |
| `{cw}:s:<sid>` | HASH — params + `landed_at` + `wa_click_at` | 24h, or until consumed |
| `{cw}:anchor` | ZSET — score = anchor ms, member = sid | trimmed per write |
| `{cw}:mob:<hash>` | STRING — cached outcome for retries | 7d |
| `{cw}:audit` | LIST — last 200 outcomes | capped |

Raw phone numbers are never stored, only salted SHA-256 hashes.

**Sessions are single-use.** The matcher selects, reads and *deletes* the
session in one atomic Lua call, so it disappears the moment it is used and two
leads can never be handed the same one. If the CRM write then fails, the caller
puts it back with its original anchor score (`restoreSession`) — otherwise a
Zoho hiccup would destroy the attribution outright.

> Testing against this instance consumes real visitor sessions. Point
> `VALKEY_URL` at a scratch instance when experimenting, or a live visitor loses
> their attribution.

## Phase 2 (later, needs accounts)

- **Interakt** outbound (User/Event Track API) + inbound webhook
  (`/api/webhooks/interakt`, HMAC-SHA256 verify). Inbound webhooks require an
  Interakt Advanced/Enterprise plan.
- **Zoho CRM** bridge — push journeys/events from the Interakt webhook. Needs
  Zoho OAuth creds and an agreed field mapping.
- **`/api/clinic/status`** postback.

Env placeholders for these already exist in `.env.example`.
