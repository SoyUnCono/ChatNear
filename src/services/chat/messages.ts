import { supabase } from "../supabase";
import { Message } from "../../types";
import { storage } from "./storage";

export const messages = {
  /**
   * Enviar un mensaje
   */
  sendMessage: async (
    chatId: string,
    content: string,
    imageUri?: string
  ): Promise<{ message: Message | null; error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      let image_url = null;

      if (imageUri) {
        const { url, error: uploadError } = await storage.uploadImage(
          chatId,
          imageUri
        );
        if (uploadError) throw uploadError;
        image_url = url;
      }

      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: content || "",
          image_url,
        })
        .select(
          `
          *,
          sender:profiles(*)
        `
        )
        .single();

      if (messageError) throw messageError;

      return { message, error: null };
    } catch (error) {
      console.error("Error en sendMessage:", error);
      return {
        message: null,
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
    return supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },

  /**
   * Marcar mensajes como leídos
   */
  markAsRead: async (chatId: string): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // Actualizar last_read en chat_participants
      const { error: participantError } = await supabase
        .from("chat_participants")
        .update({ last_read: new Date().toISOString() })
        .eq("chat_id", chatId)
        .eq("user_id", user.id);

      if (participantError) throw participantError;

      // Marcar todos los mensajes no leídos como leídos
      const { error: messagesError } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("chat_id", chatId)
        .neq("sender_id", user.id)
        .eq("read", false);

      if (messagesError) throw messagesError;

      return { error: null };
    } catch (error) {
      console.error("Error en markAsRead:", error);
      return {
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },
};
