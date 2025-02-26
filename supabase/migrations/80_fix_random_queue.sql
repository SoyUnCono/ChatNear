-- Verificar y corregir la estructura de la tabla random_queue
do $$ 
begin
  -- Eliminar la tabla si existe
  drop table if exists public.random_queue;

  -- Crear la tabla con la estructura correcta
  create table public.random_queue (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    location geography(point),
    max_distance integer default 10000,
    constraint valid_distance check (max_distance > 0)
  );

  -- Crear índices
  create index if not exists random_queue_user_id_idx on public.random_queue(user_id);
  create index if not exists random_queue_created_at_idx on public.random_queue(created_at);
  create index if not exists random_queue_location_idx on public.random_queue using gist(location);

  -- Habilitar RLS
  alter table public.random_queue enable row level security;

  -- Eliminar políticas existentes
  drop policy if exists "Los usuarios pueden ver su estado en la cola" on public.random_queue;
  drop policy if exists "Los usuarios pueden unirse a la cola" on public.random_queue;
  drop policy if exists "Los usuarios pueden actualizar su búsqueda" on public.random_queue;
  drop policy if exists "Los usuarios pueden salir de la cola" on public.random_queue;

  -- Crear nuevas políticas
  create policy "Los usuarios pueden ver todas las entradas en la cola"
    on public.random_queue for select
    using (auth.role() = 'authenticated');

  create policy "Los usuarios pueden unirse a la cola"
    on public.random_queue for insert
    with check (user_id = auth.uid());

  create policy "Los usuarios pueden actualizar su búsqueda"
    on public.random_queue for update
    using (user_id = auth.uid());

  create policy "Los usuarios pueden salir de la cola"
    on public.random_queue for delete
    using (user_id = auth.uid());

end $$; 