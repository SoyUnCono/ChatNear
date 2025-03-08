-- Crear enum para el estado de la solicitud si no existe
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'friend_request_status') then
        create type public.friend_request_status as enum ('pending', 'accepted', 'rejected');
    end if;
end $$;

-- Crear tabla de solicitudes de amistad
create table if not exists public.friend_requests (
    id uuid default gen_random_uuid() primary key,
    sender_id uuid references auth.users(id) on delete cascade not null,
    receiver_id uuid references auth.users(id) on delete cascade not null,
    status friend_request_status default 'pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    read boolean default false,
    unique(sender_id, receiver_id)
);

-- Crear índices para mejorar el rendimiento de las consultas
create index if not exists friend_requests_sender_id_idx on public.friend_requests(sender_id);
create index if not exists friend_requests_receiver_id_idx on public.friend_requests(receiver_id);
create index if not exists friend_requests_status_idx on public.friend_requests(status);

-- Habilitar RLS
alter table public.friend_requests enable row level security;

-- Eliminar políticas existentes si existen
do $$
begin
    drop policy if exists "users_can_view_their_friend_requests" on public.friend_requests;
    drop policy if exists "users_can_send_friend_requests" on public.friend_requests;
    drop policy if exists "users_can_update_their_friend_requests" on public.friend_requests;
exception
    when others then null;
end $$;

-- Crear políticas de seguridad
create policy "users_can_view_their_friend_requests"
on public.friend_requests for select
using (
    sender_id = auth.uid() or receiver_id = auth.uid()
);

create policy "users_can_send_friend_requests"
on public.friend_requests for insert
with check (sender_id = auth.uid());

create policy "users_can_update_their_friend_requests"
on public.friend_requests for update
using (
    sender_id = auth.uid() or receiver_id = auth.uid()
);

-- Función para actualizar el timestamp de actualización
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Eliminar el trigger si existe y volver a crearlo
drop trigger if exists update_friend_requests_updated_at on public.friend_requests;
create trigger update_friend_requests_updated_at
    before update on public.friend_requests
    for each row
    execute function public.update_updated_at_column(); 