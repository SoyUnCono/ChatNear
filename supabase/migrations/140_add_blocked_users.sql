-- Crear tabla de usuarios bloqueados
create table if not exists public.blocked_users (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    blocked_user_id uuid references auth.users(id) on delete cascade not null,
    blocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, blocked_user_id)
);

-- Crear índice para mejorar el rendimiento de las consultas
create index if not exists blocked_users_user_id_idx on public.blocked_users(user_id);
create index if not exists blocked_users_blocked_user_id_idx on public.blocked_users(blocked_user_id);

-- Habilitar RLS
alter table public.blocked_users enable row level security;

-- Crear políticas de seguridad
create policy "users_can_view_their_blocks"
on public.blocked_users for select
using (user_id = auth.uid());

create policy "users_can_block"
on public.blocked_users for insert
with check (user_id = auth.uid());

create policy "users_can_unblock"
on public.blocked_users for delete
using (user_id = auth.uid()); 