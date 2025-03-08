-- Agregar columnas de lectura a la tabla messages
alter table public.messages
    add column if not exists read boolean default false,
    add column if not exists read_at timestamptz,
    add column if not exists updated_at timestamptz default now();

-- Actualizar los mensajes existentes
update public.messages
set read = exists (
    select 1
    from message_reads mr
    where mr.message_id = messages.id
),
read_at = (
    select max(read_at)
    from message_reads mr
    where mr.message_id = messages.id
),
updated_at = now()
where true;

-- Crear índice para mejorar el rendimiento de las consultas de lectura
create index if not exists messages_read_idx on public.messages(read);
create index if not exists messages_read_at_idx on public.messages(read_at);

-- Comentarios
comment on column public.messages.read is 'Indica si el mensaje ha sido leído';
comment on column public.messages.read_at is 'Fecha y hora de la última lectura';
comment on column public.messages.updated_at is 'Fecha y hora de la última actualización'; 