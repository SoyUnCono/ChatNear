import { supabase } from "./supabase";
import { Chat, Message, RandomQueueEntry, ChatParticipant } from "../types";

///
/// Servicio de chat
///
export const chat = {
  /**
   * Limpiar la cola de chat aleatorio
   */
  cleanRandomQueue: async (): Promise<{ error: Error | null }> => {
    ///
    /// Intentar limpiar la cola de chat aleatorio
    ///
    try {
      // ///
      // /// Mostrar un mensaje de advertencia
      //
      // -->  console.log("Verificando cola de chat aleatorio...");

      ///
      /// Verificar el estado de la cola
      ///
      const { data: queueEntries, error: checkError } = await supabase
        ///
        /// Obtener la tabla de colas
        ///
        .from("random_queue")
        ///
        /// Seleccionar todas las entradas
        ///
        .select("*")
        ///
        /// Ordenar por fecha de creación
        ///
        .order("created_at", { ascending: true });

      ///
      /// Si hay un error, imprimir el error
      ///
      if (checkError) {
        console.error("Error verificando cola:", checkError);
        throw checkError;
      }

      ///
      /// Solo elimina entradas realmente antiguas (más de 30 minutos)
      ///
      const oldEntries = queueEntries?.filter(
        ///
        /// Si la fecha de creación es menor a 30 minutos
        ///
        (entry) =>
          new Date(entry.created_at).getTime() < Date.now() - 30 * 60 * 1000
      );

      ///
      /// Si hay entradas antiguas, eliminar las entradas
      ///
      if (oldEntries && oldEntries.length > 0) {
        ///
        /// Imprimir un mensaje de advertencia
        ///
        console.log(`Limpiando ${oldEntries.length} entradas antiguas...`);
        ///
        /// Eliminar las entradas
        ///
        const { error } = await supabase
          ///
          /// Obtener la tabla de colas
          ///
          .from("random_queue")
          ///
          /// Eliminar las entradas
          ///
          .delete()
          ///
          /// Equivalente a WHERE id IN (id1, id2, id3)
          ///
          .in(
            "id",
            oldEntries.map((e) => e.id)
          );

        ///
        /// Si hay un error, imprimir el error
        ///
        if (error) {
          console.error("Error limpiando cola:", error);
          throw error;
        }
      }

      // // Mostrar estado actual
      // console.log(
      //   ///
      //   /// Estado actual de la cola
      //   ///
      //   "Estado actual de la cola:",
      //   queueEntries?.map((entry) => ({
      //     ///
      //     /// ID del usuario
      //     ///
      //     user_id: entry.user_id,
      //     ///
      //     /// Fecha de creación
      //     ///
      //     created_at: new Date(entry.created_at).toLocaleTimeString(),
      //     ///
      //     /// Edad en minutos
      //     ///
      //     age_minutes: Math.round(
      //       (Date.now() - new Date(entry.created_at).getTime()) / 60000
      //     ),
      //   }))
      // );

      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Imprimir un mensaje de advertencia
      ///
      console.error("Error en cleanRandomQueue:", error);
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al limpiar cola"),
      };
    }
  },

  /**
   * Buscar un chat aleatorio
   */
  findRandomChat: async (
    ///
    /// Ubicación
    ///
    location: { lat: number; lng: number },
    ///
    /// Distancia máxima
    ///
    maxDistance: number = 10000
  ): Promise<{ error: Error | null }> => {
    try {
      ///
      /// Obtener el usuario actual
      ///
      const {
        ///
        /// Usuario
        ///
        data: { user },
      } = await supabase.auth.getUser();
      ///
      /// Si no hay un usuario, lanzar un error
      ///
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      ///
      /// Verificar si el usuario ya está en la cola
      ///
      const { data: existingEntry } = await supabase
        ///
        /// Obtener la tabla de colas
        ///
        .from("random_queue")
        ///
        /// Seleccionar todas las entradas
        ///
        .select("*")
        ///
        /// Equivalente a WHERE user_id = userId
        ///
        .eq("user_id", user.id)
        ///
        /// Retornar una sola entrada
        ///
        .single();

      ///
      /// Si ya está en la cola, no hacer nada
      ///
      if (existingEntry) {
        console.log("Usuario ya está en la cola");
        return { error: null };
      }

      ///
      /// Insertar al usuario en la cola
      ///
      const { error: queueError } = await supabase
        ///
        /// Obtener la tabla de colas
        ///
        .from("random_queue")
        ///
        /// Insertar al usuario en la cola
        ///
        .insert({
          ///
          /// ID del usuario
          ///
          user_id: user.id,
          ///
          /// Ubicación
          ///
          location: `POINT(${location.lng} ${location.lat})`,
          ///
          /// Distancia máxima
          ///
          max_distance: maxDistance,
        });

      ///
      /// Si hay un error, imprimir el error
      ///
      if (queueError) {
        console.error("Error insertando en la cola:", queueError);
        throw queueError;
      }

      ///
      /// Imprimir un mensaje de advertencia
      ///
      console.log("Usuario agregado a la cola exitosamente");
      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Imprimir un mensaje de advertencia
      ///
      console.error("Error en findRandomChat:", error);
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al buscar chat"),
      };
    }
  },

  /**
   * Cancelar la búsqueda de chat aleatorio
   */
  cancelRandomSearch: async (): Promise<{ error: Error | null }> => {
    try {
      ///
      /// Obtener el usuario actual
      ///
      const {
        ///
        /// Usuario
        ///
        data: { user },
      } = await supabase.auth.getUser();
      ///
      /// Si no hay un usuario, lanzar un error
      ///
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      ///
      /// Eliminar la entrada del usuario de la cola
      ///
      const { error } = await supabase
        ///
        /// Obtener la tabla de colas
        ///
        .from("random_queue")
        ///
        /// Eliminar la entrada del usuario de la cola
        ///
        .delete()
        ///
        /// Equivalente a WHERE user_id = userId
        ///
        .eq("user_id", user.id);

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) {
        console.error("Error cancelando búsqueda:", error);
        throw error;
      }

      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Imprimir un mensaje de advertencia
      ///
      console.error("Error en cancelRandomSearch:", error);
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al cancelar búsqueda"),
      };
    }
  },

  /**
   * Obtener un chat por ID
   */
  getChatById: async (
    ///
    /// ID del chat
    ///
    chatId: string
  ): Promise<{ chat: Chat | null; error: Error | null }> => {
    ///
    /// Intentar obtener el chat por ID
    ///
    try {
      ///
      /// Obtener el chat por ID
      ///
      const { data: chat, error } = await supabase
        ///
        /// Obtener la tabla de chats
        ///
        .from("chats")
        ///
        /// Seleccionar todos los chats
        ///
        .select(
          `
          *,
          participants:chat_participants(
            *,
            user:profiles(*)
          ),
          messages:messages(*)
        `
        )
        ///
        /// Equivalente a WHERE id = chatId
        ///
        .eq("id", chatId)
        ///
        /// Retornar un solo chat
        ///
        .single();

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) throw error;

      ///
      /// Retornar el chat
      ///
      return { chat, error: null };
    } catch (error) {
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Chat
        ///
        chat: null,
        ///
        /// Error
        ///
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Enviar un mensaje
   */
  sendMessage: async (
    ///
    /// ID del chat
    ///
    chatId: string,
    ///
    /// Contenido del mensaje
    ///
    content: string
  ): Promise<{ message: Message | null; error: Error | null }> => {
    try {
      ///
      /// Insertar el mensaje
      ///
      const { data: message, error } = await supabase
        ///
        /// Obtener la tabla de mensajes
        ///
        .from("messages")
        ///
        /// Insertar el mensaje
        ///
        .insert({
          ///
          /// ID del chat
          ///
          chat_id: chatId,
          ///
          /// Contenido del mensaje
          ///
          content,
        })
        ///
        /// Seleccionar el mensaje
        ///
        .select(
          `
          *,
          sender:profiles(*)
        `
        )
        ///
        /// Retornar un solo mensaje
        ///
        .single();

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) throw error;

      ///
      /// Retornar el mensaje
      ///
      return { message, error: null };
    } catch (error) {
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Mensaje
        ///
        message: null,
        ///
        /// Error
        ///
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Actualizar el estado de escritura
   */
  updateTypingStatus: async (
    ///
    /// ID del chat
    ///
    chatId: string,
    ///
    /// Estado de escritura
    ///
    isTyping: boolean
  ): Promise<{ error: Error | null }> => {
    try {
      ///
      /// Actualizar el estado de escritura
      ///
      const { error } = await supabase
        ///
        /// Obtener la tabla de participantes de chats
        ///
        .from("chat_participants")
        ///
        /// Actualizar el estado de escritura
        ///
        .update({ is_typing: isTyping })
        ///
        /// Equivalente a WHERE chat_id = chatId
        ///
        .eq("chat_id", chatId);

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) throw error;

      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Marcar mensajes como leídos
   */
  markAsRead: async (chatId: string): Promise<{ error: Error | null }> => {
    ///
    /// Intentar marcar mensajes como leídos
    ///
    try {
      ///
      /// Marcar mensajes como leídos
      ///
      const { error } = await supabase
        ///
        /// Obtener la tabla de participantes de chats
        ///
        .from("chat_participants")
        ///
        /// Actualizar el estado de escritura
        ///
        .update({ last_read: new Date().toISOString() })
        ///
        /// Equivalente a WHERE chat_id = chatId
        ///
        .eq("chat_id", chatId);

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) throw error;

      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Terminar un chat
   */
  endChat: async (chatId: string): Promise<{ error: Error | null }> => {
    ///
    /// Intentar terminar un chat
    ///
    try {
      ///
      /// Terminar un chat
      ///
      const { error } = await supabase
        ///
        /// Obtener la tabla de chats
        ///
        .from("chats")
        ///
        /// Actualizar el estado del chat
        ///
        .update({
          status: "ended",
          ended_at: new Date().toISOString(),
        })
        ///
        /// Equivalente a WHERE id = chatId
        ///
        .eq("id", chatId);

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) throw error;

      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Bloquear un chat
   */
  blockChat: async (chatId: string): Promise<{ error: Error | null }> => {
    ///
    /// Intentar bloquear un chat
    ///
    try {
      ///
      /// Bloquear un chat
      ///
      const { error } = await supabase
        .from("chats")
        .update({
          status: "blocked",
          ended_at: new Date().toISOString(),
        })
        .eq("id", chatId);

      ///
      /// Si hay un error, imprimir el error
      ///
      if (error) throw error;

      ///
      /// Retornar un error nulo
      ///
      return { error: null };
    } catch (error) {
      ///
      /// Retornar un error
      ///
      return {
        ///
        /// Error
        ///
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Suscribirse a nuevos mensajes
   */
  subscribeToMessages: (
    chatId: string,
    callback: (message: Message) => void
  ) => {
    ///
    /// Suscribirse a nuevos mensajes
    ///
    return (
      supabase
        ///
        /// Suscribirse a nuevos mensajes
        ///
        .channel(`chat:${chatId}`)
        ///
        /// Suscribirse a los cambios
        ///
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${chatId}`,
          },
          ///
          /// Callback
          ///
          (payload) => callback(payload.new as Message)
        )
        ///
        /// Suscribirse a los cambios
        ///
        .subscribe()
    );
  },

  /**
   * Suscribirse a cambios en el estado de escritura
   */
  subscribeToTyping: (
    chatId: string,
    callback: (participant: ChatParticipant) => void
  ) => {
    ///
    /// Suscribirse a cambios en el estado de escritura
    ///
    return (
      supabase
        ///
        /// Suscribirse a cambios en el estado de escritura
        ///
        .channel(`typing:${chatId}`)
        ///
        /// Suscribirse a los cambios
        ///
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_participants",
            filter: `chat_id=eq.${chatId}`,
          },
          ///
          /// Callback
          ///
          (payload) => callback(payload.new as ChatParticipant)
        )
        ///
        /// Suscribirse a los cambios
        ///
        .subscribe()
    );
  },

  /**
   * Suscribirse a cambios en el estado del chat
   */
  subscribeToChatStatus: (chatId: string, callback: (chat: Chat) => void) => {
    ///
    /// Suscribirse a cambios en el estado del chat
    ///
    return (
      supabase
        ///
        /// Suscribirse a cambios en el estado del chat
        ///
        .channel(`chat_status:${chatId}`)
        ///
        /// Suscribirse a los cambios
        ///
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chats",
            filter: `id=eq.${chatId}`,
          },
          ///
          /// Callback
          ///
          (payload) => callback(payload.new as Chat)
        )
        ///
        /// Suscribirse a los cambios
        ///
        .subscribe()
    );
  },
};
