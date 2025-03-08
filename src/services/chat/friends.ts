import { supabase } from "../supabase";

export const friends = {
  /**
   * Enviar solicitud de amistad
   */
  sendFriendRequest: async (
    userId: string
  ): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data: existingRequest } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("sender_id", user.id)
        .eq("receiver_id", userId)
        .single();

      if (existingRequest) {
        throw new Error("Ya existe una solicitud de amistad pendiente");
      }

      const { error: requestError } = await supabase
        .from("friend_requests")
        .insert([
          {
            sender_id: user.id,
            receiver_id: userId,
            status: "pending",
          },
        ]);

      if (requestError) throw requestError;

      return { error: null };
    } catch (error) {
      console.error("Error en sendFriendRequest:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al enviar solicitud de amistad"),
      };
    }
  },

  /**
   * Bloquear un chat y al usuario
   */
  blockChat: async (chatId: string): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data: participants } = await supabase
        .from("chat_participants")
        .select("user_id")
        .eq("chat_id", chatId)
        .neq("user_id", user.id);

      const otherUserId = participants?.[0]?.user_id;
      if (!otherUserId) throw new Error("No se encontró al otro usuario");

      const { error: chatError } = await supabase
        .from("chats")
        .update({
          status: "blocked",
          ended_at: new Date().toISOString(),
        })
        .eq("id", chatId);

      if (chatError) throw chatError;

      const { error: participantsError } = await supabase
        .from("chat_participants")
        .delete()
        .eq("chat_id", chatId);

      if (participantsError) throw participantsError;

      const { error: blockError } = await supabase
        .from("blocked_users")
        .insert([
          {
            user_id: user.id,
            blocked_user_id: otherUserId,
            blocked_at: new Date().toISOString(),
          },
        ]);

      if (blockError) throw blockError;

      return { error: null };
    } catch (error) {
      console.error("Error en blockChat:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al bloquear chat"),
      };
    }
  },

  /**
   * Desbloquear a un usuario
   */
  unblockUser: async (
    blockedUserId: string
  ): Promise<{ error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { error: unblockError } = await supabase
        .from("blocked_users")
        .delete()
        .eq("user_id", user.id)
        .eq("blocked_user_id", blockedUserId);

      if (unblockError) throw unblockError;

      return { error: null };
    } catch (error) {
      console.error("Error en unblockUser:", error);
      return {
        error:
          error instanceof Error
            ? error
            : new Error("Error desconocido al desbloquear usuario"),
      };
    }
  },
};
