import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase";
import { chat as chatService } from "../../../services/chat";
import { Message, Chat, User } from "../../../types";

// Hook personalizado para manejar la lógica del chat
export const useChatLogic = (chatId: string) => {
  // Estados para manejar los datos del chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chat, setChat] = useState<Chat | null>(null);

  // Obtiene el usuario actual
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setCurrentUser(data);
      }
    }
  };

  // Carga los datos iniciales del chat
  const loadChatData = async () => {
    try {
      const { data: chatData } = await supabase
        .from("chats")
        .select(
          `
          *,
          participants:chat_participants(
            user:profiles(*)
          ),
          messages(
            *,
            sender:profiles(*)
          )
        `
        )
        .eq("id", chatId)
        .single();

      if (chatData) {
        setChat(chatData);
        setMessages(chatData.messages.reverse());

        const {
          data: { user },
        } = await supabase.auth.getUser();
        const otherParticipant = chatData.participants.find(
          (p: any) => p.user.id !== user?.id
        );
        if (otherParticipant) {
          setOtherUser(otherParticipant.user);
        }

        await chatService.markAsRead(chatId);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja el envío de mensajes
  const handleSend = async (newMessage: string) => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await chatService.sendMessage(
        chatId,
        newMessage.trim()
      );
      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadChatData();
    getCurrentUser();
  }, []);

  // Efecto para suscribirse a nuevos mensajes
  useEffect(() => {
    const subscription = chatService.subscribeToMessages(chatId, (message) => {
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  return {
    messages,
    currentUser,
    otherUser,
    isLoading,
    chat,
    handleSend,
  };
};
