-- Habilitar la extensión pg_cron
create extension if not exists pg_cron;

-- Programar el job para ejecutar match_random_users cada minuto
select cron.schedule(
  'match-random-users',  -- nombre único para el job
  '* * * * *',          -- ejecutar cada minuto
  $$select public.match_random_users()$$
); 