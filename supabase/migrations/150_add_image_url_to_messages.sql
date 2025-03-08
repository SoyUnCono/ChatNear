-- Agregar columna image_url a la tabla messages
alter table public.messages
add column if not exists image_url text null;

-- Agregar comentario a la columna
comment on column public.messages.image_url is 'URL de la imagen adjunta al mensaje (opcional)';

-- Eliminar políticas existentes si existen
drop policy if exists "Los usuarios pueden insertar mensajes con imágenes" on storage.objects;
drop policy if exists "Cualquiera puede ver las imágenes de los chats" on storage.objects;
drop policy if exists "Los usuarios pueden actualizar sus propias imágenes" on storage.objects;
drop policy if exists "Los usuarios pueden eliminar sus propias imágenes" on storage.objects;

-- Política para permitir subida de imágenes
create policy "Los usuarios pueden insertar mensajes con imágenes"
on storage.objects for insert
with check (
  bucket_id = 'chat-images'
  and auth.role() = 'authenticated'
);

-- Política para permitir lectura de imágenes
create policy "Cualquiera puede ver las imágenes de los chats"
on storage.objects for select
using (
  bucket_id = 'chat-images'
);

-- Política para permitir actualización de imágenes propias
create policy "Los usuarios pueden actualizar sus propias imágenes"
on storage.objects for update
using (
  bucket_id = 'chat-images'
  and owner::text = auth.uid()::text
);

-- Política para permitir eliminación de imágenes propias
create policy "Los usuarios pueden eliminar sus propias imágenes"
on storage.objects for delete
using (
  bucket_id = 'chat-images'
  and owner::text = auth.uid()::text
); 