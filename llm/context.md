# Control-Within — LLM Context

## Changes Log

### 2026-07-27 — `utm_method` → prefilled WhatsApp message
- **Added** `src/lib/campaign.js` — client-only. Resolves the channel (meta / google / QR-chemist / QR-clinic) and the method (`utm_method=implant|hiUS`, matched case-insensitively) from the URL, and returns the matching sentence. Returns `null` rather than a partial sentence when either half is missing, so no copy is ever invented.
- **Changed** `src/components/ui/WhatsAppButton.jsx` — the *default* prefilled message is now campaign-derived. Precedence: explicit `message` prop → campaign message → the unchanged `Hi, I would like to know more information.` The six `message=` CTAs on `/ius` and `/implant` are untouched; every campaign URL lands on `/`, where no button sets one, so all campaign traffic gets the derived message.
- **Changed** `src/components/LeadCapture.jsx` — caches the landing params in `localStorage.cw_utm` so the message survives in-site navigation (the query string only exists on the first page view). Overwritten by a new campaign landing, never by an organic one.
- **Added** `utm_method` to `UTM_FIELDS` in `src/lib/attribution.js` (stored on the session) and to the `wa_click` beacon. Deliberately **not** in `sessionToZohoFields` — no `UTM_Method` field exists in the CRM and an unknown field name fails the whole Zoho update.
- Meta is detected on `platform=meta`, not `utm_source`: Meta resolves `{{site_source_name}}` to `fb`/`ig`/`msg`, never `meta`. `utm_medium=paid_social` is a backup, plus a network list (`fb`/`ig`/`facebook`/`instagram`/`messenger`/`meta`) matched against **both** `utm_source` and `utm_medium` — hand-built links put the network in either slot, e.g. the real `utm_source=offline&utm_medium=instagram`.
- Method falls back to the path when `utm_method` is absent (`/implant` → Implant, `/ius` → hIUS).
- Docs: "Prefilled WhatsApp message" in `docs/backend-setup.md`.

### 2026-07-27 — Nearest-doctor radius fallback (30 km)
- **Added** `src/data/pincodes.json` (1,430 entries, 37 KB) + `scripts/build-pincodes.mjs`, which trims the GeoNames India postal export (CC BY 4.0) to pincodes within 75 km of a doctor and stores their centroid coordinates. Rebuild whenever `doctors.json` changes: `node scripts/build-pincodes.mjs IN.txt`.
- **Added** `findWithinRadius(pincode, maxKm)` to `src/lib/doctors.js`, wired into `findByLocation()` as a 4th tier after exact pincode → postal district → city name. `NEAREST_DOCTOR_RADIUS_KM` (default 30) tunes it; the table is built to 75 km so retuning needs no rebuild.
- **Why**: matching was purely name/digit based — `distance_km` was hardcoded `0` and no radius existed anywhere. Pincode prefixes are blind to geography: Faridabad `121001` shares only 2 leading digits with Gurgaon `122xxx`, so the ≥3-digit district rule 404'd a user with a clinic 28 km away. Now `121001` → NOIDA doctor, `distance_km: 28.7`.
- A tier-4 match reports a **real measured** `distance_km`; tiers 1–3 still report `0` because they matched by area, not coordinates.
- Resolution is a local table lookup, deliberately not a live geocode — this endpoint is an Interakt webhook and cannot afford a third-party HTTP call mid-request.
- **Limit**: needs a pincode. City-only input naming a city we don't cover (`{"City":"Faridabad"}` alone) still 404s — there is nothing to measure from. Interakt should always send `Pincode`.

### 2026-07-27 — Attribution: percent-decoding + re-attribution on new campaigns
- **Changed** `clean()` in `src/lib/attribution.js` to percent-decode (up to twice, so `%2520` resolves) and collapse whitespace. A campaign name pasted into Meta Ads already encoded (`Control%20Within%20|%20July`) survives the browser's own decode and was reaching Zoho with the `%20`s intact. Applied on capture *and* on read, so sessions already stored with `%20` come out clean.
- **Changed** the write policy in `/api/attribution/claim` from unconditional fill-if-blank to **matched → overwrite, unmatched → fill-if-blank**. A returning contact's Lead already has every UTM field populated, so a later campaign could never be recorded; last touch now wins. The placeholder set still cannot clobber a real campaign value.
- Response gains `fields_overwritten`; the no-op reason is now one of `already_current` / `already_filled` / `nothing_to_write` instead of collapsing into a single case.
- **Known gap**: `IDEMPOTENCY_TTL_SEC` stays at 7 days, so a contact returning through a new campaign *within* that week hits the cache before the matcher runs and is not re-attributed. Deliberate — the retry horizon was kept over same-week re-attribution.
- **Known gap**: the `lead_id` shortcut path skips the Zoho search, so the record's current field values are unknown and everything is treated as blank — the only route by which the unmatched placeholder set can overwrite a real campaign. Needs a get-record-by-id in `src/lib/zoho.js` to close.

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

