import { useState, useEffect, useCallback } from "react";
import { Message, User, Chat } from "../../../types";
import { supabase } from "../../../services/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { useChatSettings } from "../../settings/hooks/useChatSettings";
import { ViewToken } from "react-native";
import { chat as chatService } from "../../../services/chat";

interface ChatLogicReturn {
  messages: Message[];
  currentUser: User | null;
  otherUser: User | null;
  isLoading: boolean;
  chat: Chat | null;
  handleSend: (content: string, imageUri?: string) => Promise<void>;
  handleTyping: (isTyping: boolean) => Promise<void>;
  isSending: boolean;
  onViewableItemsChanged: ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => void;
}

export const useChatLogic = (chatId: string): ChatLogicReturn => {
  // Estados
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { user } = useAuth();
  const { settings } = useChatSettings();

  // Cargar mensajes y usuarios
  useEffect(() => {
    loadChatData();

    // Marcar mensajes como leídos periódicamente cuando el chat está activo
    const markMessagesAsRead = async () => {
      try {
        if (chat && messages.length > 0) {
          await chatService.markAsRead(chatId);
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    // Marcar como leídos inmediatamente
    markMessagesAsRead();

    return () => {
      // Cleanup
    };
  }, [chatId, chat, messages]);

  const loadChatData = async () => {
    try {
      setIsLoading(true);
      // Cargar chat y participantes
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select(
          `
          *,
          participants:chat_participants(
            user_id,
            joined_at,
            last_read,
            is_typing,
            has_requested_end,
            user:profiles(*)
          )
        `
        )
        .eq("id", chatId)
        .single();

      if (chatError) throw chatError;

      // Cargar mensajes con todos los campos necesarios
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles(*),
          message_reads(user_id, read_at)
        `
        )
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;

      // Establecer datos
      setChat(chatData);

      // Procesar los mensajes con el estado de lectura
      const processedMessages = (messagesData || []).map((msg) => ({
        ...msg,
        read:
          msg.message_reads?.some((r) => r.user_id === otherUser?.id) || false,
        read_by: msg.message_reads || [],
      }));
      setMessages(processedMessages);

      // Establecer usuarios
      if (chatData?.participants) {
        const current =
          chatData.participants.find((p) => p.user_id === user?.id)?.user ||
          null;
        const other =
          chatData.participants.find((p) => p.user_id !== user?.id)?.user ||
          null;
        setCurrentUser(current);
        setOtherUser(other);

        // Marcar como leídos los mensajes visibles del otro usuario
        if (messagesData && other) {
          const unreadMessages = messagesData
            .filter(
              (msg) =>
                msg.sender_id === other.id &&
                !msg.message_reads?.some((r) => r.user_id === user?.id)
            )
            .map((msg) => msg.id);

          if (unreadMessages.length > 0) {
            markMessagesAsRead(unreadMessages);
          }
        }
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!messageIds?.length || !user?.id || !settings?.read_receipts) return;

      try {
        const timestamp = new Date().toISOString();

        // Insertar en message_reads para cada mensaje
        const readEntries = messageIds.map((messageId) => ({
          message_id: messageId,
          user_id: user.id,
          read_at: timestamp,
        }));

        const { error: readError } = await supabase
          .from("message_reads")
          .upsert(readEntries, {
            onConflict: "message_id,user_id",
          });

        if (readError) throw readError;

        // Actualizar el participante
        const { error: partError } = await supabase
          .from("chat_participants")
          .update({
            last_read: timestamp,
            last_read_message_id: messageIds[messageIds.length - 1],
          })
          .eq("chat_id", chatId)
          .eq("user_id", user.id);

        if (partError) throw partError;

        // Actualizar estado local
        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id)
              ? {
                  ...msg,
                  read: true,
                  read_at: timestamp,
                  read_by: [
                    ...(msg.read_by || []),
                    { user_id: user.id, read_at: timestamp },
                  ],
                }
              : msg
          )
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },
    [chatId, user?.id, settings?.read_receipts]
  );

  // Suscribirse a cambios en mensajes y lecturas
  useEffect(() => {
    if (!chatId || !user?.id) return;

    const channel = supabase.channel(`chat:${chatId}`);

    // Suscribirse a cambios en mensajes
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          // Obtener el mensaje completo con las relaciones
          const { data: newMessage } = await supabase
            .from("messages")
            .select(
              `
              *,
              sender:profiles(*),
              message_reads(user_id, read_at)
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (newMessage) {
            // Si el mensaje es del otro usuario, marcarlo como leído
            if (newMessage.sender_id === otherUser?.id) {
              await markMessagesAsRead([newMessage.id]);
            }

            const processedMessage = {
              ...newMessage,
              read:
                newMessage.message_reads?.some(
                  (r) => r.user_id === otherUser?.id
                ) || false,
              read_by: newMessage.message_reads || [],
            };

            setMessages((prev) => [processedMessage, ...prev]);
          }
        }
      )
      // Suscribirse a cambios en message_reads
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message_reads",
          filter: `user_id=eq.${otherUser?.id}`,
        },
        async (payload) => {
          const readEntry = payload.new as any;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === readEntry.message_id
                ? {
                    ...msg,
                    read: true,
                    read_at: readEntry.read_at,
                    read_by: [...(msg.read_by || []), readEntry],
                  }
                : msg
            )
          );
        }
      )
      // Suscribirse a cambios en chat_participants
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_participants",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          const participant = payload.new as any;
          if (participant.user_id === otherUser?.id && participant.last_read) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.sender_id === user.id &&
                new Date(msg.created_at) <= new Date(participant.last_read)
                  ? { ...msg, read: true }
                  : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [chatId, user?.id, otherUser?.id, markMessagesAsRead]);

  // Actualizar el estado de lectura cuando los mensajes son visibles
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (
        !viewableItems?.length ||
        !otherUser?.id ||
        !settings?.read_receipts ||
        !user?.id
      )
        return;

      const readableMessages = viewableItems
        .filter(
          (item) =>
            item.isViewable &&
            item.item &&
            item.item.sender_id === otherUser.id &&
            !item.item.message_reads?.some((r) => r.user_id === user.id)
        )
        .map((item) => item.item.id);

      if (readableMessages.length > 0) {
        markMessagesAsRead(readableMessages);
      }
    },
    [otherUser?.id, user?.id, settings?.read_receipts, markMessagesAsRead]
  );

  const handleSend = async (content: string, imageUri?: string) => {
    try {
      setIsSending(true);
      const timestamp = new Date().toISOString();
      const newMessage: Partial<Message> = {
        chat_id: chatId,
        sender_id: user?.id,
        content,
        image_url: imageUri,
        created_at: timestamp,
        sent: true,
        read: false,
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(newMessage)
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `
        )
        .single();

      if (error) throw error;

      // Actualizar el último mensaje en chat_participants
      await supabase
        .from("chat_participants")
        .update({
          last_message_at: timestamp,
          last_message_id: data.id,
        })
        .eq("chat_id", chatId)
        .eq("user_id", user?.id);

      setMessages((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = async (isTyping: boolean) => {
    try {
      await supabase
        .from("chat_participants")
        .update({ is_typing: isTyping })
        .eq("chat_id", chatId)
        .eq("user_id", user?.id);
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  return {
    messages,
    currentUser,
    otherUser,
    isLoading,
    chat,
    handleSend,
    handleTyping,
    isSending,
    onViewableItemsChanged,
  };
};
