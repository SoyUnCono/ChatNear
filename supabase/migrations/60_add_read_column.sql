-- Agregar columna read a la tabla messages
alter table public.messages
  add column if not exists read boolean default false;

-- Actualizar los mensajes existentes para marcarlos como leídos
update public.messages
set read = true
where created_at < now(); 