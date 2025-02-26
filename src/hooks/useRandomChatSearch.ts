import { useState, useCallback, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../services/supabase";
import { matchmaker, matchmakerEvents } from "../services/matchmaker";
import {
  NavigationProp,
  ChatParticipantPayload,
} from "../contexts/types/RandomChatTypes";

export const useRandomChatSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [maxDistance, setMaxDistance] = useState(10000); // 10km por defecto
  const navigation = useNavigation<NavigationProp>();

  // Referencia para mantener el estado de búsqueda activa
  const searchRef = useRef({ isActive: false });

  useEffect(() => {
    if (!isSearching) {
      searchRef.current.isActive = false;
      return;
    }

    searchRef.current.isActive = true;
    let stopMatchmakingFn: (() => void) | null = null;
    let matchErrorHandler: ((error: Error) => void) | null = null;

    const setupSearch = async () => {
      if (!searchRef.current.isActive) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !searchRef.current.isActive) return;

        // Verificar si el usuario ya está en la cola
        const { data: existingEntry } = await supabase
          .from("random_queue")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!searchRef.current.isActive) return;

        if (!existingEntry) {
          // Si no está en la cola, agregarlo
          const { error: queueError } = await supabase
            .from("random_queue")
            .insert([{ user_id: user.id }]);

          if (queueError) {
            console.error("Error agregando usuario a la cola:", queueError);
            if (searchRef.current.isActive) {
              setIsSearching(false);
            }
            return;
          }
        }

        // Iniciar matchmaking solo si aún estamos buscando
        if (searchRef.current.isActive) {
          stopMatchmakingFn = matchmaker.startMatchmaking();
        }
      } catch (error) {
        console.error("Error en setup:", error);
        if (searchRef.current.isActive) {
          setIsSearching(false);
        }
      }
    };

    // Suscribirse a cambios en la tabla de chats
    const channel = supabase.channel("random-chat");

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_participants",
        },
        async (payload) => {
          if (!searchRef.current.isActive) return;

          console.log("Nuevo participante detectado:", payload.new);
          const {
            data: { user },
          } = await supabase.auth.getUser();
          console.log("Usuario actual:", user?.id);

          if (
            user &&
            payload.new &&
            "user_id" in payload.new &&
            payload.new.user_id === user.id
          ) {
            console.log("Match confirmado, preparando navegación...");

            // Detener la búsqueda y matchmaking
            searchRef.current.isActive = false;
            setIsSearching(false);

            if (stopMatchmakingFn) {
              stopMatchmakingFn();
              stopMatchmakingFn = null;
            }

            if (matchErrorHandler) {
              matchmakerEvents.off("error", matchErrorHandler);
              matchErrorHandler = null;
            }

            const chatId = (payload.new as ChatParticipantPayload).chat_id;
            console.log("Navegando al chat:", chatId);

            // Navegar al chat usando replace
            navigation.replace("Chat", { chatId });

            // Mostrar mensaje de éxito
            setTimeout(() => {
              Alert.alert(
                "¡Match encontrado!",
                "Se ha encontrado un chat para ti."
              );
            }, 500);
          }
        }
      )
      .subscribe();

    // Configurar el manejador de errores
    matchErrorHandler = (error: Error) => {
      console.error("Error en matchmaking:", error);
      if (searchRef.current.isActive) {
        setIsSearching(false);
        Alert.alert(
          "Error",
          "Hubo un problema al buscar chat. Por favor intenta nuevamente."
        );
      }
    };

    matchmakerEvents.on("error", matchErrorHandler);
    setupSearch();

    return () => {
      searchRef.current.isActive = false;
      channel.unsubscribe();

      if (stopMatchmakingFn) {
        stopMatchmakingFn();
      }

      if (matchErrorHandler) {
        matchmakerEvents.off("error", matchErrorHandler);
      }
    };
  }, [isSearching, navigation]);

  const startSearch = useCallback(
    async (location: { lat: number; lng: number } | null) => {
      if (!location) {
        Alert.alert(
          "Error",
          "Necesitamos acceso a tu ubicación para encontrar personas cercanas"
        );
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          Alert.alert("Error", "No se pudo obtener el usuario actual");
          return;
        }

        // Limpiar cualquier entrada anterior en la cola
        await supabase.from("random_queue").delete().eq("user_id", user.id);

        const { error: insertError } = await supabase
          .from("random_queue")
          .insert([
            {
              user_id: user.id,
              location: `POINT(${location.lng} ${location.lat})`,
              max_distance: maxDistance,
            },
          ]);

        if (insertError) {
          console.error("Error insertando en la cola:", insertError);
          Alert.alert("Error", "No se pudo iniciar la búsqueda");
          return;
        }

        searchRef.current.isActive = true;
        setIsSearching(true);
      } catch (error) {
        console.error("Error inesperado:", error);
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Error al iniciar la búsqueda"
        );
      }
    },
    [maxDistance]
  );

  const cancelSearch = useCallback(async () => {
    try {
      searchRef.current.isActive = false;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("random_queue").delete().eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error al cancelar búsqueda:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    isSearching,
    maxDistance,
    setMaxDistance,
    startSearch,
    cancelSearch,
  };
};
