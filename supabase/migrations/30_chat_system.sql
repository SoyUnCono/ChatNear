-- Habilitar la extensión PostGIS para tipos geográficos
create extension if not exists postgis;

-- Crear enum para el estado del chat
create type public.chat_status as enum ('active', 'ended', 'blocked');

-- Crear enum para el tipo de chat
create type public.chat_type as enum ('random', 'direct');

-- Tabla de chats
create table public.chats (
    id uuid default gen_random_uuid() primary key,
    type chat_type not null,
    status chat_status default 'active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    ended_at timestamp with time zone,
    is_anonymous boolean default true
);

-- Tabla de participantes del chat
create table public.chat_participants (
    chat_id uuid references public.chats(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_read timestamp with time zone default timezone('utc'::text, now()) not null,
    is_typing boolean default false,
    primary key (chat_id, user_id)
);

-- Tabla de mensajes
create table public.messages (
    id uuid default gen_random_uuid() primary key,
    chat_id uuid references public.chats(id) on delete cascade not null,
    sender_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    is_system boolean default false
);

-- Tabla de cola de chat aleatorio
create table public.random_queue (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    location geography(point),
    max_distance integer default 10000, -- 10km por defecto
    constraint valid_distance check (max_distance > 0)
);

-- Habilitar Row Level Security
alter table public.chats enable row level security;
alter table public.chat_participants enable row level security;
alter table public.messages enable row level security;
alter table public.random_queue enable row level security;

-- Políticas para chats
create policy "Los usuarios pueden ver los chats en los que participan"
    on public.chats for select
    using (
        exists (
            select 1 from public.chat_participants
            where chat_id = id and user_id = auth.uid()
        )
    );

create policy "Los usuarios pueden crear chats"
    on public.chats for insert
    with check (true);

create policy "Los usuarios pueden actualizar los chats en los que participan"
    on public.chats for update
    using (
        exists (
            select 1 from public.chat_participants
            where chat_id = id and user_id = auth.uid()
        )
    );

-- Políticas para participantes
create policy "Los usuarios pueden ver los participantes de sus chats"
    on public.chat_participants for select
    using (
        chat_id in (
            select chat_id from public.chat_participants
            where user_id = auth.uid()
        )
    );

create policy "Los usuarios pueden unirse a chats"
    on public.chat_participants for insert
    with check (user_id = auth.uid());

create policy "Los usuarios pueden actualizar su estado en el chat"
    on public.chat_participants for update
    using (user_id = auth.uid());

-- Políticas para mensajes
create policy "Los usuarios pueden ver mensajes de sus chats"
    on public.messages for select
    using (
        chat_id in (
            select chat_id from public.chat_participants
            where user_id = auth.uid()
        )
    );

create policy "Los usuarios pueden enviar mensajes en sus chats"
    on public.messages for insert
    with check (
        sender_id = auth.uid() and
        chat_id in (
            select chat_id from public.chat_participants
            where user_id = auth.uid()
        )
    );

create policy "Los usuarios pueden editar sus propios mensajes"
    on public.messages for update
    using (sender_id = auth.uid());

-- Políticas para la cola de chat aleatorio
create policy "Los usuarios pueden ver su estado en la cola"
    on public.random_queue for select
    using (user_id = auth.uid());

create policy "Los usuarios pueden unirse a la cola"
    on public.random_queue for insert
    with check (user_id = auth.uid());

create policy "Los usuarios pueden actualizar su búsqueda"
    on public.random_queue for update
    using (user_id = auth.uid());

create policy "Los usuarios pueden salir de la cola"
    on public.random_queue for delete
    using (user_id = auth.uid());

-- Función para actualizar el timestamp de última actualización
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Trigger para actualizar el timestamp en mensajes
create trigger set_updated_at
    before update on public.messages
    for each row
    execute function public.handle_updated_at();

-- Función para actualizar last_read al enviar un mensaje
create or replace function public.handle_message_sent()
returns trigger as $$
begin
    update public.chat_participants
    set last_read = new.created_at
    where chat_id = new.chat_id and user_id = new.sender_id;
    return new;
end;
$$ language plpgsql;

-- Trigger para actualizar last_read al enviar un mensaje
create trigger on_message_sent
    after insert on public.messages
    for each row
    execute function public.handle_message_sent();

-- Índices para mejorar el rendimiento
create index chat_participants_user_id_idx on public.chat_participants(user_id);
create index messages_chat_id_idx on public.messages(chat_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index random_queue_location_idx on public.random_queue using gist(location);
create index random_queue_created_at_idx on public.random_queue(created_at); 