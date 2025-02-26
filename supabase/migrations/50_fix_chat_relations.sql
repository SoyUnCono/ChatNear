-- Primero, asegurémonos de que la tabla profiles existe y tiene las columnas necesarias
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  username text unique,
  avatar_url text,
  status text default 'offline',
  last_seen timestamp with time zone
);

-- Verificar y actualizar la estructura de la tabla profiles
do $$ 
begin
  -- Agregar columnas si no existen
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'name') then
    alter table public.profiles add column name text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'username') then
    alter table public.profiles add column username text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'avatar_url') then
    alter table public.profiles add column avatar_url text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'status') then
    alter table public.profiles add column status text default 'offline';
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'last_seen') then
    alter table public.profiles add column last_seen timestamp with time zone;
  end if;
end $$;

-- Asegurarnos de que las columnas de chat_participants referencian correctamente
alter table public.chat_participants
  drop constraint if exists chat_participants_user_id_fkey,
  add constraint chat_participants_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade;

-- Asegurarnos de que las columnas de messages referencian correctamente
alter table public.messages
  drop constraint if exists messages_sender_id_fkey,
  add constraint messages_sender_id_fkey
    foreign key (sender_id)
    references public.profiles(id)
    on delete cascade;

-- Actualizar la consulta en useChats para usar las relaciones correctas
comment on table public.chat_participants is 'Tabla de participantes de chat';
comment on column public.chat_participants.user_id is E'@foreignKey (profiles.id) user\nID del usuario participante';

comment on table public.messages is 'Tabla de mensajes';
comment on column public.messages.sender_id is E'@foreignKey (profiles.id) sender\nID del remitente del mensaje';

-- Insertar perfiles faltantes
insert into public.profiles (id, name, username)
select 
  id,
  coalesce(raw_user_meta_data->>'name', raw_user_meta_data->>'username'),
  raw_user_meta_data->>'username'
from auth.users
where id not in (select id from public.profiles); 