-- Crear tabla de chats silenciados
create table if not exists public.muted_chats (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    chat_id uuid references public.chats(id) on delete cascade not null,
    muted_until timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, chat_id)
);

-- Crear índice para mejorar el rendimiento de las consultas
create index if not exists muted_chats_user_id_idx on public.muted_chats(user_id);
create index if not exists muted_chats_chat_id_idx on public.muted_chats(chat_id);
create index if not exists muted_chats_muted_until_idx on public.muted_chats(muted_until);

-- Habilitar RLS
alter table public.muted_chats enable row level security;

-- Crear políticas de seguridad
create policy "users_can_view_their_muted_chats"
on public.muted_chats for select
using (user_id = auth.uid());

create policy "users_can_mute_chats"
on public.muted_chats for insert
with check (user_id = auth.uid());

create policy "users_can_unmute_chats"
on public.muted_chats for delete
using (user_id = auth.uid());

create policy "users_can_update_their_muted_chats"
on public.muted_chats for update
using (user_id = auth.uid()); 