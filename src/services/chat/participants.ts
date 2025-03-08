import { supabase } from "../supabase";
import { ChatParticipant } from "../../types";

export const participants = {
  /**
   * Actualizar el estado de escritura
   */
  updateTypingStatus: async (
    chatId: string,
    isTyping: boolean
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .from("chat_participants")
        .update({ is_typing: isTyping })
        .eq("chat_id", chatId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error en updateTypingStatus:", error);
      return {
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Suscribirse a cambios en el estado de escritura
   */
  subscribeToTyping: (
    chatId: string,
    callback: (participant: ChatParticipant) => void
  ) => {
    return supabase
      .channel(`typing:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_participants",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => callback(payload.new as ChatParticipant)
      )
      .subscribe();
  },

  /**
   * Silenciar un chat
   */
  muteChat: async (
    chatId: string,
    mutedUntil: Date | null
  ): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data: existingMute } = await supabase
        .from("muted_chats")
        .select("id")
        .eq("chat_id", chatId)
        .eq("user_id", user.id)
        .single();

      if (existingMute) {
        const { error: updateError } = await supabase
          .from("muted_chats")
          .update({
            muted_until: mutedUntil,
          })
          .eq("id", existingMute.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("muted_chats")
          .insert([
            {
              chat_id: chatId,
              user_id: user.id,
              muted_until: mutedUntil,
            },
          ]);

        if (insertError) throw insertError;
      }

      return { error: null };
    } catch (error) {
      console.error("Error en muteChat:", error);
      return {
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },

  /**
   * Eliminar un chat para el usuario actual
   */
  deleteChat: async (chatId: string): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { error: updateError } = await supabase
        .from("chats")
        .update({
          status: "ended",
          ended_at: new Date().toISOString(),
        })
        .eq("id", chatId);

      if (updateError) throw updateError;

      const { error: participantError } = await supabase
        .from("chat_participants")
        .delete()
        .eq("chat_id", chatId)
        .eq("user_id", user.id);

      if (participantError) throw participantError;

      return { error: null };
    } catch (error) {
      console.error("Error en deleteChat:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al eliminar chat"),
      };
    }
  },
};
