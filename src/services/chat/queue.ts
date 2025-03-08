import { supabase } from "../supabase";
import { Chat } from "../../types";

export const queue = {
  /**
   * Limpiar la cola de chat aleatorio
   */
  cleanRandomQueue: async (): Promise<{ error: Error | null }> => {
    try {
      const { data: queueEntries, error: checkError } = await supabase
        .from("random_queue")
        .select("*")
        .order("created_at", { ascending: true });

      if (checkError) throw checkError;

      const oldEntries = queueEntries?.filter(
        (entry) =>
          new Date(entry.created_at).getTime() < Date.now() - 30 * 60 * 1000
      );

      if (oldEntries && oldEntries.length > 0) {
        const { error } = await supabase
          .from("random_queue")
          .delete()
          .in(
            "id",
            oldEntries.map((e) => e.id)
          );

        if (error) throw error;
      }

      return { error: null };
    } catch (error) {
      console.error("Error en cleanRandomQueue:", error);
      return {
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
    location: { lat: number; lng: number },
    maxDistance: number = 10000
  ): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data: existingEntry } = await supabase
        .from("random_queue")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingEntry) {
        console.log("Usuario ya está en la cola");
        return { error: null };
      }

      const { error: queueError } = await supabase.from("random_queue").insert({
        user_id: user.id,
        location: `POINT(${location.lng} ${location.lat})`,
        max_distance: maxDistance,
      });

      if (queueError) throw queueError;

      return { error: null };
    } catch (error) {
      console.error("Error en findRandomChat:", error);
      return {
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { error } = await supabase
        .from("random_queue")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error en cancelRandomSearch:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al cancelar búsqueda"),
      };
    }
  },

  /**
   * Suscribirse a cambios en el estado del chat
   */
  subscribeToChatStatus: (chatId: string, callback: (chat: Chat) => void) => {
    return supabase
      .channel(`chat_status:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
          filter: `id=eq.${chatId}`,
        },
        (payload) => callback(payload.new as Chat)
      )
      .subscribe();
  },
};
