# Control-Within — LLM Context

## Changes Log

### 2026-07-27 — UTM attribution: Valkey sessions → Zoho Lead
- **Added** `src/lib/valkey.js` — lazy ioredis singleton on `VALKEY_URL` (Aiven Valkey, `rediss://`), plus the `attrClaim` Lua script that selects and claims the best-matching session atomically in one round trip.
- **Added** `src/lib/attribution.js` — param whitelist, session recording, `Created_at` parsing (ISO / `YYYY-MM-DD HH:mm:ss` as UTC / epoch s / epoch ms), anchor resolution, salted mobile hashing, phone variants, claim release, audit ring.
- **Added** `POST /api/attribution/session` (browser pings: `land`, `wa_click`), `POST /api/attribution/claim` (Interakt webhook, `x-api-key` auth), `GET /api/attribution/debug` (recent outcomes + window config).
- **Changed** `src/components/LeadCapture.jsx` — now mints a `cw_sid` session id into localStorage and reports every landing (organic included, so an unrecorded session can't be mistaken for someone else's paid one). The old `/api/lead` chatId flow stays disabled.
- **Changed** `src/components/ui/WhatsAppButton.jsx` — `sendBeacon`s a `wa_click` event inside `triggerRedirect()`, the single choke point every WhatsApp exit passes through. That instant is the matching anchor.
- Matching is time-proximity against Interakt's `Created_at`, with a fallback to API arrival time for returning contacts. Writes are **fill-if-blank**; an unmatched claim writes the `Whatsapp` / `Connexi * Howl` placeholder set. Requires Zoho Flow to no longer pre-fill the UTM fields.
- **Sessions are single-use**: the Lua matcher deletes the hash and removes the anchor member as it hands the data back, so a session can never be matched twice. A failed CRM write calls `restoreSession()` to put it back at its original anchor score. There is no longer a `{cw}:claim:<sid>` guard key — deletion *is* the guard.
- **Zoho's search index lags record creation by up to ~100s** (measured). The claim route does one inline search, then answers Interakt immediately with `deferred:true` and keeps retrying via `after()` at 8/15/30/45/60s. Passing `lead_id` in the body skips the lookup entirely.
- Fallback values come from `.env` (`ATTR_DEFAULT_*`); a missing var logs `defaults.env_missing` before falling back to the built-in literal.
- **`UTM_Source` is excluded from all writes** — owned by the WhatsApp phrase system. The claim route's `ZOHO_UTM_FIELDS` whitelist is the single place that enforces it; the field is still reported in the response for visibility.
- Docs: see the "UTM attribution" section in `docs/backend-setup.md`.

### 2026-07-03 — Public Nearest-Doctor API for Interakt
- **Added** `src/app/api/nearest-doctor/route.js` — a stateless, public POST endpoint that accepts `{ latitude, longitude }` and returns the nearest doctor as flat JSON (no nested objects) for direct mapping in Interakt's "Trigger a Webhook" → "Save Response" workflow step.
- CORS headers included (`Access-Control-Allow-Origin: *`) so Interakt and Postman can call freely.
- No journey tracking or Zoho CRM writes — this is a headless lookup. The existing `/api/locate` continues to serve the web UI with full journey + CRM integration.

### 2026-07-03 — Updated to city + pincode lookup
- **Changed** `/api/nearest-doctor` to accept `{ "location": "Delhi 110009" }` instead of lat/lng. The single `location` key holds a free-text string with city and/or pincode.
- **Added** `findByLocation()` to `src/lib/doctors.js` — parses the string to extract a 6-digit pincode and/or city name, matches by pincode first (most specific), falls back to city name (case-insensitive, partial match).
- Interakt workflow now sends the user's typed city+pincode as one string in the webhook body.

