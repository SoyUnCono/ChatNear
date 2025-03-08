-- Eliminar tabla si existe
drop table if exists public.message_reads cascade;

-- Crear la tabla message_reads
create table if not exists public.message_reads (
    id uuid default gen_random_uuid() primary key,
    message_id uuid not null references public.messages(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    read_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    constraint message_reads_unique unique (message_id, user_id)
);

-- Agregar índices para mejorar el rendimiento
create index if not exists message_reads_message_id_idx on public.message_reads(message_id);
create index if not exists message_reads_user_id_idx on public.message_reads(user_id);

-- Habilitar RLS
alter table public.message_reads enable row level security;

-- Eliminar políticas existentes si existen
drop policy if exists "Los usuarios pueden ver los registros de lectura de sus mensajes" on public.message_reads;
drop policy if exists "Los usuarios pueden marcar mensajes como leídos" on public.message_reads;
drop policy if exists "Los usuarios pueden actualizar sus propias lecturas" on public.message_reads;

-- Políticas de seguridad
create policy "Los usuarios pueden ver los registros de lectura de sus mensajes"
on public.message_reads for select
using (
    auth.uid() in (
        select sender_id from messages where id = message_reads.message_id
        union
        select cp.user_id from chat_participants cp
        join messages m on m.chat_id = cp.chat_id
        where m.id = message_reads.message_id
    )
);

create policy "Los usuarios pueden marcar mensajes como leídos"
on public.message_reads for insert
with check (
    auth.uid() = user_id and
    exists (
        select 1 from chat_participants cp
        join messages m on m.chat_id = cp.chat_id
        where m.id = message_reads.message_id
        and cp.user_id = auth.uid()
    )
);

create policy "Los usuarios pueden actualizar sus propias lecturas"
on public.message_reads for update
using (auth.uid() = user_id);

-- Comentarios
comment on table public.message_reads is 'Registros de lectura de mensajes';
comment on column public.message_reads.message_id is 'ID del mensaje';
comment on column public.message_reads.user_id is 'ID del usuario que leyó el mensaje';
comment on column public.message_reads.read_at is 'Fecha y hora de lectura';

-- Eliminar trigger si existe
drop trigger if exists tr_update_message_read on public.message_reads;
drop function if exists public.fn_update_message_read();

-- Trigger para actualizar el campo read en messages
create or replace function public.fn_update_message_read()
returns trigger as $$
begin
    -- Actualizar el mensaje como leído
    update messages
    set read = true,
        read_at = new.read_at,
        updated_at = now()
    where id = new.message_id;
    
    -- Actualizar el último mensaje leído en chat_participants
    update chat_participants
    set last_read = new.read_at,
        last_read_message_id = new.message_id,
        updated_at = now()
    where user_id = new.user_id
    and chat_id = (select chat_id from messages where id = new.message_id);
    
    return new;
end;
$$ language plpgsql security definer;

create trigger tr_update_message_read
after insert on public.message_reads
for each row
execute function public.fn_update_message_read(); 