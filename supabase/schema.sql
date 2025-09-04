-- جداول Supabase المقترحة للفحص الإبداعي
create table if not exists public.screenings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  fluency int not null,
  flexibility int not null,
  novelty int not null,
  total int not null,
  recommendations text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.screenings enable row level security;

create policy if not exists "screenings_select_own"
  on public.screenings for select
  using (auth.uid() = user_id);

create policy if not exists "screenings_insert_own"
  on public.screenings for insert
  with check (auth.uid() = user_id);
