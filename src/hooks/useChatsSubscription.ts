import { useEffect, useRef, useCallback } from "react";
import { supabase } from "../services/supabase";
import { Chat, Message } from "../types";

export const useChatsSubscription = (
  onNewMessage: (chatId: string, message: Message) => void,
  onChatUpdate: (chat: Chat) => void
) => {
  const channelsRef = useRef<{ [key: string]: any }>({});

  // Suscripción global a nuevos mensajes
  const setupGlobalMessageSubscription = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const channel = supabase
      .channel("global_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          try {
            // Verificar si el mensaje es para un chat del usuario
            const { data: participant } = await supabase
              .from("chat_participants")
              .select("chat_id")
              .eq("chat_id", payload.new.chat_id)
              .eq("user_id", user.id)
              .single();

            if (!participant) return;

            // Obtener el mensaje completo
            const { data: message } = await supabase
              .from("messages")
              .select(
                `
                *,
                sender:profiles(
                  id,
                  username,
                  name,
                  avatar_url
                )
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (message) {
              console.log("Nuevo mensaje global recibido:", message);
              onNewMessage(payload.new.chat_id, message);
            }
          } catch (error) {
            console.error("Error procesando mensaje global:", error);
          }
        }
      )
      .subscribe((status) => {
        console.log("Estado de suscripción global a mensajes:", status);
      });

    return channel;
  }, [onNewMessage]);

  // Suscripción global a actualizaciones de chat
  const setupGlobalChatSubscription = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const channel = supabase
      .channel("global_chats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        async (payload) => {
          try {
            // Verificar si el usuario es participante del chat
            const { data: participant } = await supabase
              .from("chat_participants")
              .select("chat_id")
                .eq("chat_id", payload.old?)
              .eq("user_id", user.id)
              .single();

            if (!participant) return;

            if (payload.eventType === "DELETE") {
              console.log("Chat eliminado:", payload.old.id);
              return;
            }

            // Obtener el chat actualizado
            const { data: updatedChat } = await supabase
              .from("chats")
              .select(
                `
                *,
                participants:chat_participants(
                  user:profiles(
                    id,
                    username,
                    name,
                    avatar_url,
                    status
                  )
                )
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (updatedChat) {
              console.log("Chat global actualizado:", updatedChat);
              onChatUpdate(updatedChat);
            }
          } catch (error) {
            console.error(
              "Error procesando actualización global de chat:",
              error
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Estado de suscripción global a chats:", status);
      });

    return channel;
  }, [onChatUpdate]);

  useEffect(() => {
    let isSubscribed = true;
    let checkInterval: NodeJS.Timeout;

    const setupSubscriptions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !isSubscribed) return;

        console.log("Configurando suscripciones globales...");

        // Limpiar suscripciones existentes
        Object.values(channelsRef.current).forEach((channel) => {
          if (channel) channel.unsubscribe();
        });
        channelsRef.current = {};

        // Configurar suscripciones globales
        const messagesChannel = await setupGlobalMessageSubscription();
        const chatsChannel = await setupGlobalChatSubscription();

        if (messagesChannel) {
          channelsRef.current.messages = messagesChannel;
        }
        if (chatsChannel) {
          channelsRef.current.chats = chatsChannel;
        }

        console.log("Suscripciones globales configuradas");
      } catch (error) {
        console.error("Error configurando suscripciones:", error);
      }
    };

    setupSubscriptions();

    // Verificar suscripciones cada 15 segundos
    checkInterval = setInterval(() => {
      const activeChannels = Object.values(channelsRef.current).filter(
        (channel) => channel?.subscription?.state === "SUBSCRIBED"
      );

      if (activeChannels.length === 0) {
        console.log("No se encontraron canales activos, reconectando...");
        setupSubscriptions();
      }
    }, 15000);

    return () => {
      console.log("Limpiando suscripciones...");
      isSubscribed = false;
      clearInterval(checkInterval);

      Object.values(channelsRef.current).forEach((channel) => {
        if (channel) channel.unsubscribe();
      });
      channelsRef.current = {};
    };
  }, [setupGlobalMessageSubscription, setupGlobalChatSubscription]);
};
