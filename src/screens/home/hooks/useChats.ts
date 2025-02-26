import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase";
import { Chat, DbChat } from "../../../types";

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();

    // Suscribirse a cambios en los chats
    const channel = supabase.channel("public:chats");

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        () => {
          loadChats();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadChats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener los chats activos del usuario con los participantes más recientes
      const { data: chatParticipants, error } = await supabase
        .from("chat_participants")
        .select(
          `
          chat:chats!inner (
            id,
            type,
            status,
            created_at,
            ended_at,
            is_anonymous,
            participants:chat_participants!inner (
              user_id,
              joined_at,
              last_read,
              is_typing,
              has_requested_end,
              user:profiles!inner (
                id,
                name,
                username,
                avatar_url,
                status,
                last_seen
              )
            ),
            messages (
              id,
              content,
              created_at,
              sender_id,
              read,
              sender:profiles (
                id,
                name,
                username,
                avatar_url
              )
            )
          )
        `
        )
        .eq("user_id", user.id)
        .eq("chat.status", "active")
        .eq("has_requested_end", false)
        .order("chat(created_at)", { ascending: false });

      if (error) throw error;

      // Procesar los chats para eliminar duplicados por usuario
      const uniqueChats = new Map();

      (chatParticipants || []).forEach((rawParticipant) => {
        const rawChat = (rawParticipant as any).chat;
        if (!rawChat) return;

        // Encontrar el otro participante
        const otherParticipant = rawChat.participants.find(
          (p: any) => p.user_id !== user.id
        );
        if (!otherParticipant) return;

        // Si ya tenemos un chat con este usuario, solo mantener el más reciente
        const existingChat = uniqueChats.get(otherParticipant.user_id);
        if (
          existingChat &&
          new Date(existingChat.created_at) > new Date(rawChat.created_at)
        ) {
          return;
        }

        const chat = {
          id: rawChat.id,
          type: rawChat.type,
          status: rawChat.status,
          created_at: rawChat.created_at,
          ended_at: rawChat.ended_at,
          is_anonymous: rawChat.is_anonymous,
          participants: rawChat.participants.map((p: any) => ({
            chat_id: rawChat.id,
            user_id: p.user_id,
            joined_at: p.joined_at,
            last_read: p.last_read,
            is_typing: p.is_typing,
            has_requested_end: p.has_requested_end,
            user: p.user,
          })),
          messages: (rawChat.messages || []).map((m: any) => ({
            ...m,
            chat_id: rawChat.id,
            updated_at: m.created_at,
            is_system: false,
          })),
          lastMessage: rawChat.messages?.[0]
            ? {
                ...rawChat.messages[0],
                chat_id: rawChat.id,
                updated_at: rawChat.messages[0].created_at,
                is_system: false,
              }
            : undefined,
          unreadCount: (rawChat.messages || []).filter(
            (m: any) => !m.read && m.sender_id !== user.id
          ).length,
        };

        uniqueChats.set(otherParticipant.user_id, chat);
      });

      console.log(
        "Chats procesados:",
        Array.from(uniqueChats.values()).map((chat) => ({
          id: chat.id,
          otherUser: chat.participants?.find((p: any) => p.user_id !== user.id)
            ?.user,
          is_anonymous: chat.is_anonymous,
        }))
      );

      setChats(Array.from(uniqueChats.values()));
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    chats,
    loading,
    refreshChats: loadChats,
  };
};
