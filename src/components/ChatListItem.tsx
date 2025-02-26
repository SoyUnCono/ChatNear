import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Chat, User } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { formatRelativeTime } from "../utils/date";
import { supabase } from "../services/supabase";
import { Ionicons } from "@expo/vector-icons";

////
/// Tipos
////
interface ChatListItemProps {
  ///
  /// Chat
  ///
  chat: Chat;
}

////
/// Tipos de navegación
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

////
/// Componente de lista de chat
////
export const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  ////
  /// Estado
  ///
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  ////
  /// Navegación
  ///
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Tema
  ///
  const { theme } = useTheme();

  ////
  /// Efecto: Obtener el ID del usuario actual
  ///
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
  }, []);

  ////
  /// Obtener el otro usuario del chat
  ///
  const otherUser = chat.participants?.find(
    (p) => p.user_id !== currentUserId
  )?.user;

  ////
  /// Obtener el nombre para mostrar
  ///
  const getDisplayName = () => {
    if (!otherUser) return "Usuario";

    if (otherUser.username) {
      return `@${otherUser.username}`;
    }

    if (otherUser.name) {
      return otherUser.name;
    }

    return chat.is_anonymous ? "Usuario Anónimo" : "Usuario";
  };

  ////
  /// Presionar
  ///
  const handlePress = () => {
    ////
    /// Navegar al chat
    ///
    navigation.navigate("Chat", { chatId: chat.id });
  };

  ////
  /// Manejar finalización del chat
  ///
  const handleEndChat = async () => {
    try {
      // 1. Marcar que este usuario ha solicitado finalizar el chat
      const { error: updateError } = await supabase
        .from("chat_participants")
        .update({ has_requested_end: true })
        .eq("chat_id", chat.id)
        .eq("user_id", currentUserId);

      if (updateError) throw updateError;

      // 2. Verificar si ambos usuarios han solicitado finalizar
      const { data: participants, error: checkError } = await supabase
        .from("chat_participants")
        .select("has_requested_end")
        .eq("chat_id", chat.id);

      if (checkError) throw checkError;

      const allRequestedEnd = participants?.every((p) => p.has_requested_end);

      if (allRequestedEnd) {
        // Si ambos usuarios han solicitado finalizar, terminar el chat
        const { error: chatError } = await supabase
          .from("chats")
          .update({
            status: "ended",
            ended_at: new Date().toISOString(),
          })
          .eq("id", chat.id);

        if (chatError) throw chatError;

        // Eliminar a los participantes del chat
        const { error: deleteError } = await supabase
          .from("chat_participants")
          .delete()
          .eq("chat_id", chat.id);

        if (deleteError) throw deleteError;

        Alert.alert(
          "Chat finalizado",
          "El chat ha sido finalizado por ambos usuarios y podrán volver a conectar en el futuro"
        );
      } else {
        Alert.alert(
          "Solicitud enviada",
          "Has solicitado finalizar el chat. Se finalizará cuando el otro usuario también lo solicite."
        );
      }
    } catch (error) {
      console.error("Error al finalizar el chat:", error);
      Alert.alert(
        "Error",
        "No se pudo procesar tu solicitud. Por favor intenta nuevamente."
      );
    }
  };

  ////
  /// Mostrar menú contextual
  ///
  const showContextMenu = () => {
    Alert.alert("Opciones del chat", "¿Qué deseas hacer con este chat?", [
      {
        text: "Finalizar chat",
        onPress: () => {
          Alert.alert(
            "Confirmar finalización",
            "¿Estás seguro de que deseas finalizar este chat? El chat solo se finalizará cuando ambos usuarios lo soliciten, permitiendo que puedan volver a conectar en el futuro.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Finalizar",
                onPress: handleEndChat,
                style: "destructive",
              },
            ]
          );
        },
        style: "destructive",
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  ////
  /// Renderizado
  ///
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.background.primary,
          borderBottomColor: theme.border.primary,
        },
      ]}
      onPress={handlePress}
      onLongPress={showContextMenu}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {otherUser?.avatar_url ? (
          <Image
            source={{ uri: otherUser.avatar_url }}
            style={styles.avatar}
            defaultSource={require("../assets/default-avatar.png")}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.placeholderAvatar,
              { backgroundColor: theme.background.secondary },
            ]}
          >
            <Ionicons name="person" size={24} color={theme.icon.secondary} />
          </View>
        )}
        {otherUser?.status === "online" && (
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: theme.status.success,
                borderColor: theme.background.primary,
              },
            ]}
          />
        )}
      </View>

      {/* Información del chat */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.name, { color: theme.text.primary }]}
            numberOfLines={1}
          >
            {getDisplayName()}
          </Text>
          <Text
            style={[styles.time, { color: theme.text.secondary }]}
            numberOfLines={1}
          >
            {formatRelativeTime(chat.lastMessage?.created_at)}
          </Text>
        </View>

        <Text
          style={[styles.message, { color: theme.text.secondary }]}
          numberOfLines={2}
        >
          {chat.lastMessage?.content || "No hay mensajes"}
        </Text>

        {/* Indicador de mensajes no leídos */}
        {chat.unreadCount ? (
          <View
            style={[
              styles.unreadBadge,
              { backgroundColor: theme.action.primary },
            ]}
          >
            <Text style={styles.unreadCount}>
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  placeholderAvatar: {
    backgroundColor: "#E1E1E1",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
