-- Crear el bucket para las imágenes de chat si no existe
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do update
set public = true; 