-- Deshabilitar RLS temporalmente para hacer los cambios
alter table public.chat_participants disable row level security;

-- Agregar campo para rastrear solicitudes de finalización
alter table public.chat_participants
add column if not exists has_requested_end boolean default false;

-- Crear índice para mejorar el rendimiento de las consultas
create index if not exists chat_participants_has_requested_end_idx 
on public.chat_participants(chat_id) 
where has_requested_end = true;

-- Actualizar las políticas existentes
drop policy if exists "participant_update_policy" on public.chat_participants;

create policy "participant_update_policy" on public.chat_participants
for update using (
    user_id = auth.uid() or 
    exists (
        select 1 
        from public.chat_participants 
        where chat_id = chat_participants.chat_id 
        and user_id = auth.uid()
    )
);

-- Habilitar RLS nuevamente
alter table public.chat_participants enable row level security; 