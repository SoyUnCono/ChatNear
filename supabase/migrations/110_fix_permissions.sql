-- Deshabilitar temporalmente RLS para hacer los cambios
alter table public.chats disable row level security;
alter table public.chat_participants disable row level security;
alter table public.messages disable row level security;
alter table public.random_queue disable row level security;

-- Eliminar todas las políticas existentes
drop policy if exists "Los usuarios pueden ver los chats en los que participan" on public.chats;
drop policy if exists "Los usuarios pueden crear chats" on public.chats;
drop policy if exists "Los usuarios pueden actualizar los chats en los que participan" on public.chats;

drop policy if exists "Los usuarios pueden ver los participantes de sus chats" on public.chat_participants;
drop policy if exists "Los usuarios pueden unirse a chats" on public.chat_participants;
drop policy if exists "Los usuarios pueden actualizar su estado en el chat" on public.chat_participants;

drop policy if exists "Los usuarios pueden ver mensajes de sus chats" on public.messages;
drop policy if exists "Los usuarios pueden enviar mensajes en sus chats" on public.messages;
drop policy if exists "Los usuarios pueden editar sus propios mensajes" on public.messages;

drop policy if exists "Los usuarios pueden ver todas las entradas en la cola" on public.random_queue;
drop policy if exists "Los usuarios pueden unirse a la cola" on public.random_queue;
drop policy if exists "Los usuarios pueden actualizar su búsqueda" on public.random_queue;
drop policy if exists "Los usuarios pueden salir de la cola" on public.random_queue;

-- Crear nuevas políticas simplificadas para chats
create policy "chat_select_policy" on public.chats
  for select using (
    auth.uid() in (
      select user_id from public.chat_participants where chat_id = id
    )
  );

create policy "chat_insert_policy" on public.chats
  for insert with check (auth.role() = 'authenticated');

create policy "chat_update_policy" on public.chats
  for update using (
    auth.uid() in (
      select user_id from public.chat_participants where chat_id = id
    )
  );

-- Crear nuevas políticas simplificadas para participantes
create policy "participant_select_policy" on public.chat_participants
  for select using (auth.role() = 'authenticated');

create policy "participant_insert_policy" on public.chat_participants
  for insert with check (auth.role() = 'authenticated');

create policy "participant_update_policy" on public.chat_participants
  for update using (user_id = auth.uid());

create policy "participant_delete_policy" on public.chat_participants
  for delete using (user_id = auth.uid());

-- Crear nuevas políticas simplificadas para mensajes
create policy "message_select_policy" on public.messages
  for select using (
    chat_id in (
      select chat_id from public.chat_participants where user_id = auth.uid()
    )
  );

create policy "message_insert_policy" on public.messages
  for insert with check (
    chat_id in (
      select chat_id from public.chat_participants where user_id = auth.uid()
    )
  );

create policy "message_update_policy" on public.messages
  for update using (sender_id = auth.uid());

-- Crear nuevas políticas simplificadas para la cola de búsqueda
create policy "queue_select_policy" on public.random_queue
  for select using (auth.role() = 'authenticated');

create policy "queue_insert_policy" on public.random_queue
  for insert with check (
    user_id = auth.uid() and
    auth.role() = 'authenticated'
  );

create policy "queue_update_policy" on public.random_queue
  for update using (user_id = auth.uid());

create policy "queue_delete_policy" on public.random_queue
  for delete using (user_id = auth.uid());

-- Habilitar RLS nuevamente
alter table public.chats enable row level security;
alter table public.chat_participants enable row level security;
alter table public.messages enable row level security;
alter table public.random_queue enable row level security;

-- Asegurarse de que las tablas tengan los índices correctos
create index if not exists chat_participants_user_id_idx on public.chat_participants(user_id);
create index if not exists chat_participants_chat_id_idx on public.chat_participants(chat_id);
create index if not exists messages_chat_id_idx on public.messages(chat_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists random_queue_user_id_idx on public.random_queue(user_id);
create index if not exists random_queue_created_at_idx on public.random_queue(created_at); 