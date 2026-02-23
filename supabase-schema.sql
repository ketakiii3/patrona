-- ============================================
-- Patrona Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- 1. Users table (names + safe words only, no addresses)
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  safe_word text not null,
  created_at timestamptz default now()
);

-- 2. Emergency contacts (linked to users)
create table if not exists emergency_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  name text not null,
  phone text not null,
  relationship text,
  created_at timestamptz default now()
);

-- 3. Location pings (real-time tracking during walks)
create table if not exists location_pings (
  id uuid default gen_random_uuid() primary key,
  session_id text unique not null,
  latitude double precision not null,
  longitude double precision not null,
  timestamp bigint not null,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Index for fast session lookups
create index if not exists idx_location_pings_session_id on location_pings(session_id);

-- Index for cleanup queries
create index if not exists idx_location_pings_timestamp on location_pings(timestamp);

-- Enable Row Level Security (required by Supabase)
alter table users enable row level security;
alter table emergency_contacts enable row level security;
alter table location_pings enable row level security;

-- Service role policies (our serverless functions use the service key, so they bypass RLS)
-- For the location_pings table, allow public read so tracking pages work without auth
create policy "Allow public read of location pings"
  on location_pings for select
  using (true);

-- Allow service role full access (serverless functions)
-- Note: service_role key bypasses RLS by default, so these are mainly for documentation
create policy "Service role manages users"
  on users for all
  using (true);

create policy "Service role manages contacts"
  on emergency_contacts for all
  using (true);

create policy "Service role manages pings"
  on location_pings for all
  using (true);
