create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

drop policy if exists "feedback_insert" on public.feedback;
create policy "feedback_insert" on public.feedback
  for insert with check (true);

drop policy if exists "feedback_select_none" on public.feedback;
create policy "feedback_select_none" on public.feedback
  for select using (false);

grant insert on public.feedback to anon, authenticated;
