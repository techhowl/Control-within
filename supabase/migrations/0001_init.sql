-- ============================================================================
-- Control Within — journey tracking schema
-- ----------------------------------------------------------------------------
-- Two tables only. The microsite earns a WhatsApp click and stamps a tracking
-- id (journey_id). Real funnel logic lives downstream in Interakt + Zoho; this
-- DB is operational scaffolding for stitching a visitor's context together.
--
-- Run this in the Supabase SQL Editor (or `supabase db push`) once per project.
-- ============================================================================

-- gen_random_uuid() lives in pgcrypto (preinstalled on Supabase, but be explicit).
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- journeys: one row per visitor "first touch", carries context to conversion.
-- ---------------------------------------------------------------------------
create table if not exists public.journeys (
  journey_id    uuid primary key default gen_random_uuid(),
  short_ref     text not null unique,            -- nanoid, 8 chars, used in wa.me text as [short_ref]
  entry_path    text,                            -- first URL path the visitor landed on
  profile_hint  text,                            -- inferred interest: 'implant' | 'hius' | 'undecided'
  age_band      text,                            -- coarse, never an exact age
  gender        text,
  utm_source    text,
  utm_medium    text,
  utm_creative  text,
  created_at    timestamptz not null default now(),
  consent_at    timestamptz,                     -- set at explicit WhatsApp opt-in (DPDP)
  erased_at     timestamptz                      -- soft marker; row is hard-deleted on erasure
);

-- ---------------------------------------------------------------------------
-- journey_events: append-only event log, cascades away with its journey.
-- ---------------------------------------------------------------------------
create table if not exists public.journey_events (
  id          bigserial primary key,
  journey_id  uuid not null references public.journeys(journey_id) on delete cascade,
  event_type  text not null,                     -- see EVENT_TYPES in src/lib/journey.js
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_journey_events_journey_id on public.journey_events(journey_id);
create index if not exists idx_journeys_short_ref        on public.journeys(short_ref);

-- ---------------------------------------------------------------------------
-- Row Level Security: lock both tables down. All access is server-side through
-- route handlers using the SERVICE ROLE key, which bypasses RLS. With RLS on
-- and no policies, the public anon key can read/write nothing — which is what
-- we want for sensitive health-adjacent data.
-- ---------------------------------------------------------------------------
alter table public.journeys       enable row level security;
alter table public.journey_events enable row level security;
