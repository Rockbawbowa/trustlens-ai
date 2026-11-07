-- TrustLens AI Supabase-ready schema
-- Apply in a project with auth enabled. The local demo layer remains the default
-- until these environment variables are configured.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  tool_type text not null check (tool_type in ('trustlens', 'scamshield', 'documatch')),
  title text not null,
  status text not null default 'processing' check (status in ('processing', 'completed', 'failed')),
  overall_assessment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_files (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  result_type text not null check (result_type in ('trustlens', 'scamshield', 'documatch')),
  result_data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_files enable row level security;
alter table public.analysis_results enable row level security;

create policy "profiles are readable by the owner"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles are editable by the owner"
  on public.profiles for update using (auth.uid() = id);

create policy "analyses belong to their owner"
  on public.analyses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analysis files follow their analysis owner"
  on public.analysis_files for all using (
    exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())
  );
create policy "analysis results follow their analysis owner"
  on public.analysis_results for all using (
    exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())
  );
