-- Crear el bucket para avatares si no existe
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Habilitar RLS en la tabla de objetos
alter table storage.objects enable row level security;

-- Eliminar políticas existentes si las hay
drop policy if exists "Avatares accesibles públicamente" on storage.objects;
drop policy if exists "Los usuarios pueden subir sus propios avatares" on storage.objects;
drop policy if exists "Los usuarios pueden actualizar sus propios avatares" on storage.objects;
drop policy if exists "Los usuarios pueden eliminar sus propios avatares" on storage.objects;

-- Crear nuevas políticas

-- 1. Política para permitir ver avatares públicamente
create policy "Avatares accesibles públicamente"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 2. Política para permitir a los usuarios subir sus propios avatares
create policy "Los usuarios pueden subir sus propios avatares"
on storage.objects for insert
with check (
  bucket_id = 'avatars' AND
  (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- 3. Política para permitir a los usuarios actualizar sus propios avatares
create policy "Los usuarios pueden actualizar sus propios avatares"
on storage.objects for update
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Política para permitir a los usuarios eliminar sus propios avatares
create policy "Los usuarios pueden eliminar sus propios avatares"
on storage.objects for delete
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
); 