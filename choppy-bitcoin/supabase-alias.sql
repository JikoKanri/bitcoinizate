-- Run without RLS. Adds monthly alias cap.

alter table public.profiles
  add column if not exists alias_changed_at timestamptz;

create or replace function public.guard_profile_alias()
returns trigger
language plpgsql
as '
begin
  if tg_op = ''UPDATE'' and new.username is distinct from old.username then
    if old.alias_changed_at is not null
       and old.alias_changed_at > now() - interval ''30 days'' then
      new.username := old.username;
      new.alias_changed_at := old.alias_changed_at;
    else
      new.alias_changed_at := now();
    end if;
  end if;
  return new;
end;
';

drop trigger if exists guard_profile_alias on public.profiles;
create trigger guard_profile_alias
  before update on public.profiles
  for each row execute function public.guard_profile_alias();
