-- ============================================================
-- CARTA CERO — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

create table public.atenciones (
  id             uuid        default gen_random_uuid() primary key,
  created_at     timestamptz default now()             not null,
  fecha_atencion timestamptz                            not null,
  prestador      text                                   not null,
  compania       text                                   not null,
  -- poliza      text,  -- PÓLIZA: disabled. Uncomment to enable.
  beneficio      text                                   not null,
  prestacion     text                                   not null,
  cie10          text                                   not null,
  cie10_desc     text,
  monto          numeric(10, 2)                         not null,
  solicitud_por  text
);

-- All access goes through the service_role key in Cloudflare Functions,
-- which bypasses RLS. Enable RLS anyway as a defence-in-depth measure
-- so the anon/public key cannot access this table at all.
alter table public.atenciones enable row level security;

-- No policies are created: only the service_role key (used server-side)
-- can read or write. The anon key used by any browser client cannot.
