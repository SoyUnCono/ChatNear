-- Agregar campo read a la tabla friend_requests
alter table public.friend_requests
add column if not exists read boolean default false;

-- Crear índice para mejorar el rendimiento de las consultas
create index if not exists friend_requests_read_idx on public.friend_requests(read); 