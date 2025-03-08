import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Chat, User } from "../types";

export const useChatListItem = (chat: Chat) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<User | undefined>();
  const [unreadCount, setUnreadCount] = useState(0);

  // Obtener el usuario actual
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
      }
    });
  }, []);

  // Obtener el otro usuario y configurar suscripciones
  useEffect(() => {
    if (currentUserId) {
      // Obtener el otro usuario
      const other = chat.participants?.find(
        (p) => p.user_id !== currentUserId
      )?.user;
      setOtherUser(other);

      // Calcular mensajes no leídos
      const calculateUnreadCount = async () => {
        try {
          const { count, error: countError } = await supabase
            .from("messages")
            .select("*", { count: "exact" })
            .eq("chat_id", chat.id)
            .neq("sender_id", currentUserId)
            .not(
              "id",
              "in",
              `(select message_id from message_reads where user_id = '${currentUserId}')`
            );

          if (countError) throw countError;
          setUnreadCount(count || 0);
        } catch (error) {
          console.error("Error calculating unread count:", error);
        }
      };

      calculateUnreadCount();

      // Suscribirse a cambios en mensajes y lecturas
      const channel = supabase.channel(`chat-list:${chat.id}`);

      channel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${chat.id}`,
          },
          (payload) => {
            const newMessage = payload.new as any;
            if (newMessage.sender_id !== currentUserId) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "message_reads",
            filter: `user_id=eq.${currentUserId}`,
          },
          () => {
            calculateUnreadCount();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_participants",
            filter: `chat_id=eq.${chat.id}`,
          },
          (payload) => {
            const participant = payload.new as any;
            if (
              participant.user_id === currentUserId &&
              participant.last_read
            ) {
              calculateUnreadCount();
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [chat.id, chat.participants, currentUserId]);

  return {
    currentUserId,
    lastMessage: chat.lastMessage,
    unreadCount,
    otherUser,
  };
};
