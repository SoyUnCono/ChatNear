-- Deshabilitar temporalmente RLS
alter table public.chats disable row level security;

-- Eliminar políticas existentes
drop policy if exists "chat_select_policy" on public.chats;
drop policy if exists "chat_insert_policy" on public.chats;
drop policy if exists "chat_update_policy" on public.chats;

-- Crear políticas más permisivas para chats
create policy "chat_select_policy" on public.chats
  for select using (true);

create policy "chat_insert_policy" on public.chats
  for insert with check (true);

create policy "chat_update_policy" on public.chats
  for update using (true);

-- Habilitar RLS nuevamente
alter table public.chats enable row level security; 