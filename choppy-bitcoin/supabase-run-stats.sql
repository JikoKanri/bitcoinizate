-- Run in the Supabase SQL editor. Safe to re-run.

alter table public.profiles add column if not exists score_time double precision;
alter table public.profiles add column if not exists run_stats jsonb;

drop function if exists public.submit_choppy_score(bigint, double precision, integer);
drop function if exists public.submit_choppy_score(bigint, double precision, integer, jsonb);

create or replace function public.submit_choppy_score(
  p_score bigint,
  p_life double precision,
  p_candles integer,
  p_stats jsonb default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as '
declare
  uid uuid := auth.uid();
  old_score bigint;
  old_time double precision;
  last_at timestamptz;
begin
  if uid is null then
    raise exception ''not signed in'';
  end if;
  if p_score is null or p_score <= 0 or p_score > 2100000000000 then
    raise exception ''bad score'';
  end if;
  if p_life is null or p_life < 12 then
    raise exception ''short run'';
  end if;
  if p_candles is null or p_candles < 3 then
    raise exception ''few candles'';
  end if;
  if p_candles > (p_life * 5 + 8) then
    raise exception ''candle rate'';
  end if;
  if p_score > (8000 + p_candles * 200000) then
    raise exception ''score vs candles'';
  end if;

  select highscore, score_time, last_score_at into old_score, old_time, last_at
  from public.profiles where id = uid;
  if not found then
    raise exception ''no profile'';
  end if;
  if last_at is not null and last_at > now() - interval ''15 seconds'' then
    raise exception ''slow down'';
  end if;
  if old_score is null then old_score := 0; end if;
  if p_score < old_score then
    return old_score;
  end if;
  if p_score = old_score and old_time is not null and p_life >= old_time then
    return old_score;
  end if;

  perform set_config(''app.score_ok'', ''1'', true);
  update public.profiles
     set highscore = p_score,
         last_score_at = now(),
         score_time = p_life,
         run_stats = p_stats
   where id = uid;

  insert into public.score_log (user_id, score, life_t, candles)
  values (uid, p_score, p_life, p_candles);

  return p_score;
end;
';

revoke all on function public.submit_choppy_score(bigint, double precision, integer, jsonb) from public;
grant execute on function public.submit_choppy_score(bigint, double precision, integer, jsonb) to authenticated;
