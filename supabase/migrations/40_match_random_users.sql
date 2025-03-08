-- Función para calcular la distancia entre dos puntos
create or replace function public.calculate_distance(
  lat1 float,
  lon1 float,
  lat2 float,
  lon2 float
) returns float as $$
declare
  R constant float := 6371; -- Radio de la Tierra en kilómetros
  dlat float;
  dlon float;
  a float;
  c float;
begin
  -- Convertir grados a radianes
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  -- Fórmula de Haversine
  a := (sin(dlat/2))^2 + cos(radians(lat1)) * cos(radians(lat2)) * (sin(dlon/2))^2;
  c := 2 * asin(sqrt(a));
  
  return R * c;
end;
$$ language plpgsql;

-- Eliminar el trigger primero
drop trigger if exists match_random_users_trigger on public.random_queue;

-- Eliminar las funciones existentes
drop function if exists public.match_random_users();
drop function if exists public.match_random_users_trigger();
drop function if exists public.process_random_matches();

-- Función principal para procesar matches aleatorios
create function public.process_random_matches() returns void as $$
declare
  entry1 record;
  entry2 record;
  chat_id uuid;
  distance float;
  lat1 float;
  lon1 float;
  lat2 float;
  lon2 float;
  is_blocked boolean;
begin
  -- Iterar sobre los usuarios en la cola
  for entry1 in (
    select * from public.random_queue
    order by created_at asc
  ) loop
    -- Para cada usuario, buscar un match
    for entry2 in (
      select * from public.random_queue
      where id > entry1.id -- Evitar duplicados
      order by created_at asc
    ) loop
      -- Verificar si alguno de los usuarios ha bloqueado al otro
      select exists(
        select 1 from public.blocked_users
        where (user_id = entry1.user_id and blocked_user_id = entry2.user_id)
           or (user_id = entry2.user_id and blocked_user_id = entry1.user_id)
      ) into is_blocked;
      
      -- Si hay bloqueo, continuar con el siguiente par
      if is_blocked then
        continue;
      end if;

      -- Si ambos tienen ubicación, verificar distancia
      if entry1.location is not null and entry2.location is not null then
        -- Extraer coordenadas
        lat1 := st_y(entry1.location::geometry);
        lon1 := st_x(entry1.location::geometry);
        lat2 := st_y(entry2.location::geometry);
        lon2 := st_x(entry2.location::geometry);
        
        -- Calcular distancia
        distance := calculate_distance(lat1, lon1, lat2, lon2);
        
        -- Si la distancia es mayor que el máximo de cualquiera, continuar
        if distance > entry1.max_distance or distance > entry2.max_distance then
          continue;
        end if;
      end if;

      -- Crear el chat
      insert into public.chats (type, status, is_anonymous)
      values ('random', 'active', true)
      returning id into chat_id;

      -- Agregar participantes
      insert into public.chat_participants (chat_id, user_id)
      values
        (chat_id, entry1.user_id),
        (chat_id, entry2.user_id);

      -- Enviar mensaje de sistema
      insert into public.messages (chat_id, content, sender_id, is_system)
      values (chat_id, '¡Chat iniciado! 👋', entry1.user_id, true);

      -- Eliminar entradas de la cola
      delete from public.random_queue where id in (entry1.id, entry2.id);

      -- Salir del bucle interno
      exit;
    end loop;
  end loop;
end;
$$ language plpgsql;

-- Función del trigger que llama a la función principal
create function public.match_random_users_trigger() returns trigger as $$
begin
  perform public.process_random_matches();
  return NEW;
end;
$$ language plpgsql;

-- Crear un trigger para ejecutar la función
create trigger match_random_users_trigger
  after insert on public.random_queue
  for each row
  execute function public.match_random_users_trigger();

-- Crear un job que ejecute la función cada minuto
create extension if not exists pg_cron;

select cron.schedule(
  'match-random-users',  -- nombre único para el job
  '* * * * *',          -- ejecutar cada minuto
  $$select public.process_random_matches()$$
); 