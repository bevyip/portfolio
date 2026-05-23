-- Run in Supabase Dashboard → SQL Editor (or via linked git migration).

create table if not exists public.flowers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  image_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists flowers_created_at_idx on public.flowers (created_at asc);

alter table public.flowers enable row level security;

create policy "Anyone can read flowers"
  on public.flowers
  for select
  to anon, authenticated
  using (true);

-- Inserts/updates/deletes use the service role key from your API only.

insert into storage.buckets (id, name, public)
values ('flowers', 'flowers', true)
on conflict (id) do update set public = true;

create policy "Anyone can view flower images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'flowers');

-- Browser sessions for /flower (one increment per session via API).
create table if not exists public.garden_stats (
  id text primary key default 'default',
  page_views bigint not null default 127 check (page_views >= 0)
);

insert into public.garden_stats (id, page_views)
values ('default', 127)
on conflict (id) do nothing;

alter table public.garden_stats enable row level security;

create or replace function public.increment_garden_page_views()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.garden_stats
  set page_views = page_views + 1
  where id = 'default'
  returning page_views into new_count;

  return new_count;
end;
$$;

revoke all on function public.increment_garden_page_views() from public;
grant execute on function public.increment_garden_page_views() to service_role;
