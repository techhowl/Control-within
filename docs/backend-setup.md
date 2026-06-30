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

## Phase 2 (later, needs accounts)

- **Interakt** outbound (User/Event Track API) + inbound webhook
  (`/api/webhooks/interakt`, HMAC-SHA256 verify). Inbound webhooks require an
  Interakt Advanced/Enterprise plan.
- **Zoho CRM** bridge — push journeys/events from the Interakt webhook. Needs
  Zoho OAuth creds and an agreed field mapping.
- **`/api/clinic/status`** postback.

Env placeholders for these already exist in `.env.example`.
