-- Eliminar las políticas existentes que causan recursión
drop policy if exists "Los usuarios pueden ver los participantes de sus chats" on public.chat_participants;
drop policy if exists "Los usuarios pueden ver mensajes de sus chats" on public.messages;

-- Crear nuevas políticas sin recursión
create policy "Los usuarios pueden ver los participantes de sus chats"
on public.chat_participants for select
using (user_id = auth.uid());

create policy "Los usuarios pueden ver mensajes de sus chats"
on public.messages for select
using (
  exists (
    select 1 
    from public.chat_participants 
    where chat_participants.chat_id = messages.chat_id 
    and chat_participants.user_id = auth.uid()
  )
); 