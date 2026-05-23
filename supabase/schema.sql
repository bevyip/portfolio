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
