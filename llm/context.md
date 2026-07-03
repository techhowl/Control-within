# Control-Within — LLM Context

## Changes Log

### 2026-07-03 — Public Nearest-Doctor API for Interakt
- **Added** `src/app/api/nearest-doctor/route.js` — a stateless, public POST endpoint that accepts `{ latitude, longitude }` and returns the nearest doctor as flat JSON (no nested objects) for direct mapping in Interakt's "Trigger a Webhook" → "Save Response" workflow step.
- CORS headers included (`Access-Control-Allow-Origin: *`) so Interakt and Postman can call freely.
- No journey tracking or Zoho CRM writes — this is a headless lookup. The existing `/api/locate` continues to serve the web UI with full journey + CRM integration.

### 2026-07-03 — Updated to city + pincode lookup
- **Changed** `/api/nearest-doctor` to accept `{ "location": "Delhi 110009" }` instead of lat/lng. The single `location` key holds a free-text string with city and/or pincode.
- **Added** `findByLocation()` to `src/lib/doctors.js` — parses the string to extract a 6-digit pincode and/or city name, matches by pincode first (most specific), falls back to city name (case-insensitive, partial match).
- Interakt workflow now sends the user's typed city+pincode as one string in the webhook body.

