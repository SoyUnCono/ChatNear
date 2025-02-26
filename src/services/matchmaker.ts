import { supabase } from "./supabase";
import { eventEmitter } from "./eventEmitter";

///
/// Exportar el emisor de eventos para su uso en otros componentes
///
export const matchmakerEvents = eventEmitter;

// ///
// /// Interfaz de la cola de usuarios aleatorios
// ///
// interface RandomQueueEntry {
//   ///
//   /// ID de la entrada
//   ///
//   id: string;
//   ///
//   /// ID del usuario
//   ///
//   user_id: string;
//   ///
//   /// Ubicación del usuario
//   ///
//   location: string | null;
//   ///
//   /// Distancia máxima
//   ///
//   max_distance: number;
//   ///
//   /// Fecha de creación
//   ///
//   created_at: string;
// }

/**
 * Servicio de matchmaking para chats aleatorios
 */
export const matchmaker = {
  /**
   * Buscar matches
   */
  findMatches: async () => {
    ///
    /// Intentar buscar matches
    ///
    try {
      ///
      /// Obtener el usuario autenticado
      ///
      const {
        data: { user },
      } = await supabase.auth.getUser();
      ///
      /// Si no hay usuario autenticado, retornar false
      ///
      if (!user) {
        console.log("No hay usuario autenticado");
        return false;
      }
      // ///
      // /// Imprimir el usuario actual
      // ///
      // console.log("Usuario actual:", user.id);

      ///
      /// Obtener usuarios en la cola
      ///
      const { data: queueEntries, error: queueError } = await supabase
        ///
        /// Obtener la tabla de la cola de usuarios aleatorios
        ///
        .from("random_queue")
        ///
        /// Seleccionar todos los usuarios
        ///
        .select("*")
        ///
        /// Ordenar por fecha de creación
        ///
        .order("created_at", { ascending: true });

      ///
      /// Si hay un error, emitir el error
      ///
      if (queueError) {
        ///
        /// Imprimir el error
        ///
        console.error("Error obteniendo cola:", queueError);
        ///
        /// Emitir el error
        ///
        matchmakerEvents.emit("error", queueError);
        ///
        /// Retornar false
        ///
        return false;
      }

      ///
      /// Verificar si el usuario actual sigue en la cola
      ///
      const currentUserInQueue = queueEntries?.some(
        (entry) => entry.user_id === user.id
      );
      ///
      /// Si el usuario actual no está en la cola, retornar false
      ///
      if (!currentUserInQueue) {
        ///
        /// Imprimir el mensaje
        ///
        console.log("Usuario actual ya no está en la cola");
        ///
        /// Retornar false
        ///
        return false;
      }

      ///
      /// Si no hay usuarios en la cola o hay menos de 2, imprimir el mensaje
      ///
      if (!queueEntries || queueEntries.length < 2) {
        ///
        /// Imprimir el mensaje
        ///
        console.log("Esperando más usuarios. Estado actual:", {
          ///
          /// Total de usuarios en la cola
          ///
          totalUsers: queueEntries?.length || 0,
          ///
          /// Usuarios en la cola
          ///
          users: queueEntries?.map((entry) => ({
            ///
            /// ID del usuario
            ///
            user_id: entry.user_id,
            ///
            /// Fecha de creación
            ///
            created_at: new Date(entry.created_at).toLocaleTimeString(),
            ///
            /// Si es el usuario actual
            ///
            isCurrentUser: entry.user_id === user.id,
          })),
        });
        ///
        /// Retornar true
        ///
        return true;
      }

      // console.log("Usuarios en cola:", {
      //   totalUsers: queueEntries.length,
      //   users: queueEntries.map((entry) => ({
      //     user_id: entry.user_id,
      //     created_at: new Date(entry.created_at).toLocaleTimeString(),
      //     isCurrentUser: entry.user_id === user.id,
      //   })),
      // });

      ///
      /// Procesar usuarios en pares
      ///
      for (let i = 0; i < queueEntries.length - 1; i += 2) {
        ///
        /// Obtener el primer usuario
        ///
        const user1 = queueEntries[i];
        ///
        /// Obtener el segundo usuario
        ///
        const user2 = queueEntries[i + 1];
        ///
        /// Si ambos usuarios existen
        ///
        if (user1 && user2) {
          ///
          /// Imprimir el intento de match
          ///
          // console.log("Intentando match entre usuarios:", {
          //   user1: {
          //     id: user1.user_id,
          //     created_at: new Date(user1.created_at).toLocaleTimeString(),
          //     isCurrentUser: user1.user_id === user.id,
          //   },
          //   user2: {
          //     id: user2.user_id,
          //     created_at: new Date(user2.created_at).toLocaleTimeString(),
          //     isCurrentUser: user2.user_id === user.id,
          //   },
          // });

          ///
          /// Verificar que ambos usuarios aún están en la cola
          ///
          const { data: currentEntries, error: checkError } = await supabase
            ///
            /// Obtener la tabla de la cola de usuarios aleatorios
            ///
            .from("random_queue")
            ///
            /// Seleccionar el ID del usuario
            ///
            .select("user_id")
            ///
            /// Equivalente a WHERE user_id IN (user1.user_id, user2.user_id)
            ///
            .in("user_id", [user1.user_id, user2.user_id]);

          ///
          /// Si hay un error, emitir el error
          ///
          if (checkError) {
            ///
            /// Imprimir el error
            ///
            console.error("Error verificando usuarios:", checkError);
            ///
            /// Retornar false
            ///
            continue;
          }

          ///
          /// Si no hay usuarios en la cola o hay menos de 2, imprimir el mensaje
          ///
          if (!currentEntries || currentEntries.length !== 2) {
            ///
            /// Imprimir el mensaje
            ///
            console.log("Al menos uno de los usuarios ya no está en la cola");
            ///
            /// Retornar false
            ///
            continue;
          }

          ///
          /// Eliminar usuarios de la cola antes de crear el chat
          ///
          const { error: deleteError } = await supabase
            ///
            /// Obtener la tabla de la cola de usuarios aleatorios
            ///
            .from("random_queue")
            ///
            /// Eliminar los usuarios
            ///
            .delete()
            ///
            /// Equivalente a WHERE user_id IN (user1.user_id, user2.user_id)
            ///
            .in("user_id", [user1.user_id, user2.user_id]);

          ///
          /// Si hay un error, emitir el error
          ///
          if (deleteError) {
            ///
            /// Imprimir el error
            ///
            console.error("Error eliminando usuarios de la cola:", deleteError);
            ///
            /// Retornar false
            ///
            continue;
          }

          // ///
          // /// Imprimir el mensaje
          // ///
          //   console.log("Usuarios eliminados de la cola");

          ///
          /// Crear el chat
          ///
          const { data: chat, error: chatError } = await supabase
            ///
            /// Obtener la tabla de chats
            ///
            .from("chats")
            ///
            /// Insertar el chat
            ///
            .insert([
              {
                ///
                /// Tipo de chat
                ///
                type: "random",
                ///
                /// Estado del chat
                ///
                status: "active",
                ///
                /// Si es anónimo
                ///
                is_anonymous: true,
              },
            ])
            ///
            /// Seleccionar el chat
            ///
            .select()
            ///
            /// Retornar un solo chat
            ///
            .single();

          ///
          /// Si hay un error, emitir el error
          ///
          if (chatError || !chat) {
            ///
            /// Imprimir el error
            ///
            console.error("Error creando chat:", chatError);
            ///
            /// Emitir el error
            ///
            matchmakerEvents.emit("error", new Error("Error creando chat"));
            ///
            /// Retornar false
            ///
            continue;
          }

          // ///
          // /// Imprimir el mensaje
          // ///
          // console.log("Chat creado:", chat.id);

          ///
          /// Agregar participantes
          ///
          const { error: participantsError } = await supabase
            ///
            /// Obtener la tabla de participantes de chats
            ///
            .from("chat_participants")
            ///
            /// Insertar los participantes
            ///
            .insert([
              { chat_id: chat.id, user_id: user1.user_id },
              { chat_id: chat.id, user_id: user2.user_id },
            ]);

          ///
          /// Si hay un error, emitir el error
          ///
          if (participantsError) {
            ///
            /// Imprimir el error
            ///
            console.error("Error agregando participantes:", participantsError);
            ///
            /// Emitir el error
            ///
            matchmakerEvents.emit(
              "error",
              new Error("Error agregando participantes al chat")
            );
            ///
            /// Retornar false
            ///
            continue;
          }

          // ///
          // /// Imprimir el mensaje
          // ///
          // console.log("Participantes agregados al chat:", chat.id);

          ///
          /// Si el usuario actual fue emparejado, detener la búsqueda
          ///
          if (user1.user_id === user.id || user2.user_id === user.id) {
            ///
            /// Retornar false
            ///
            return false;
          }
        }
      }

      ///
      /// Verificar si el usuario actual sigue en la cola después del proceso
      ///
      const { data: remainingUser } = await supabase
        ///
        /// Obtener la tabla de la cola de usuarios aleatorios
        ///
        .from("random_queue")
        ///
        /// Seleccionar el ID del usuario
        ///
        .select("user_id")
        ///
        /// Equivalente a WHERE user_id = user.id
        ///
        .eq("user_id", user.id);

      ///
      /// Retornar true si el usuario sigue en la cola
      ///
      return !!remainingUser;
    } catch (error) {
      ///
      /// Imprimir el error
      ///
      console.error("Error en findMatches:", error);
      ///
      /// Emitir el error
      ///
      matchmakerEvents.emit(
        "error",
        error instanceof Error ? error : new Error("Error desconocido")
      );
      ///
      /// Retornar false
      ///
      return false;
    }
  },

  /**
   * Iniciar matchmaking
   */
  startMatchmaking: () => {
    ///
    /// Imprimir el mensaje
    ///
    console.log("Iniciando matchmaking...");
    ///
    /// Iniciar el matchmaking
    ///
    let isActive = true;
    ///
    /// ID del intervalo
    ///
    let intervalId: NodeJS.Timeout;

    ///
    /// Verificar y emparejar
    ///
    const checkAndMatch = async () => {
      ///
      /// Si no está activo, detener el intervalo
      ///
      if (!isActive) {
        clearInterval(intervalId);
        return;
      }
      ///
      /// Intentar verificar y emparejar
      ///
      try {
        ///
        /// Verificar y continuar
        ///
        const shouldContinue = await matchmaker.findMatches();
        ///
        /// Si no hay más búsquedas necesarias, desactivar el matchmaking
        ///
        if (!shouldContinue) {
          ///
          /// Desactivar el matchmaking
          ///
          isActive = false;
          ///
          /// Detener el intervalo
          ///
          clearInterval(intervalId);
        }
      } catch (error) {
        ///
        /// Imprimir el error
        ///
        console.error("Error en matchmaking:", error);
        ///
        /// Desactivar el matchmaking
        ///
        isActive = false;
        ///
        /// Detener el intervalo
        ///
        clearInterval(intervalId);
      }
    };

    ///
    /// Primera ejecución inmediata
    ///
    checkAndMatch();

    ///
    /// Iniciar el intervalo solo si la primera ejecución no detuvo el proceso
    ///
    intervalId = setInterval(() => {
      ///
      /// Si está activo, verificar y continuar
      ///
      if (isActive) {
        ///
        /// Verificar y continuar
        ///
        checkAndMatch();
      } else {
        ///
        /// Detener el intervalo
        ///
        clearInterval(intervalId);
      }
    }, 2000);

    return () => {
      ///
      /// Imprimir el mensaje
      ///
      console.log("Deteniendo matchmaking manualmente");
      ///
      /// Desactivar el matchmaking
      ///
      isActive = false;
      ///
      /// Detener el intervalo
      ///
      clearInterval(intervalId);
    };
  },
};
