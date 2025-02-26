-- Eliminar la constraint existente si existe
alter table public.random_queue
  drop constraint if exists random_queue_user_id_fkey;

-- Agregar la nueva constraint que referencia a profiles
alter table public.random_queue
  add constraint random_queue_user_id_fkey
  foreign key (user_id)
  references public.profiles(id)
  on delete cascade;

-- Verificar que la tabla profiles existe y tiene la estructura correcta
do $$ 
begin
  -- Asegurarnos de que la tabla profiles existe
  if not exists (select 1 from pg_tables where tablename = 'profiles' and schemaname = 'public') then
    create table public.profiles (
      id uuid references auth.users on delete cascade primary key,
      username text unique,
      avatar_url text,
      status text default 'offline',
      last_seen timestamp with time zone
    );
  end if;

  -- Asegurarnos de que las columnas necesarias existen
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'username') then
    alter table public.profiles add column username text unique;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'status') then
    alter table public.profiles add column status text default 'offline';
  end if;
end $$; 