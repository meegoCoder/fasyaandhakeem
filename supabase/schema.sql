-- Run this once in the Supabase Dashboard: SQL Editor > New query.
-- Visitors may submit an RSVP, but cannot list, edit, or delete RSVP records.

create table if not exists public.rsvps (
  id bigint generated always as identity primary key,
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 120),
  attendance text not null check (attendance in ('hadir', 'tidak')),
  guest_count integer not null default 0 check (guest_count between 0 and 20),
  wish text check (wish is null or char_length(wish) <= 1000),
  created_at timestamptz not null default now(),
  check ((attendance = 'hadir' and guest_count >= 1) or (attendance = 'tidak' and guest_count = 0))
);

alter table public.rsvps enable row level security;

revoke all on table public.rsvps from anon, authenticated;
grant usage on schema public to anon;
grant insert on table public.rsvps to anon;
grant usage on sequence public.rsvps_id_seq to anon;

drop policy if exists "Guests can submit RSVPs" on public.rsvps;

create policy "Guests can submit RSVPs"
on public.rsvps
for insert
to anon
with check (true);

-- The website can read only combined attendance figures, never individual data.
create or replace function public.rsvp_totals()
returns table(hadir bigint, tidak_hadir bigint)
language sql
security definer
set search_path = ''
as $$
  select
    coalesce(sum(case when attendance = 'hadir' then guest_count else 0 end), 0)::bigint,
    coalesce(sum(case when attendance = 'tidak' then 1 else 0 end), 0)::bigint
  from public.rsvps;
$$;

revoke all on function public.rsvp_totals() from public;
grant execute on function public.rsvp_totals() to anon;

-- The public guestbook returns only names and wishes that guests chose to share.
create or replace function public.rsvp_recent_wishes()
returns table(guest_name text, wish text)
language sql
security definer
set search_path = ''
as $$
  select guest_name, wish
  from public.rsvps
  where nullif(trim(wish), '') is not null
  order by created_at asc
  limit 1000;
$$;

revoke all on function public.rsvp_recent_wishes() from public;
grant execute on function public.rsvp_recent_wishes() to anon;

-- Refresh Supabase's API schema so the website can call rsvp_totals immediately.
notify pgrst, 'reload schema';
