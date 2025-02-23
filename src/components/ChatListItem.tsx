import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Chat } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { formatRelativeTime } from "../utils/date";

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
  /// Navegación
  ///
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Tema
  ///
  const { theme } = useTheme();

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
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {chat.otherUser.avatar_url ? (
          <Image
            source={{ uri: chat.otherUser.avatar_url }}
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
          />
        )}
        {chat.otherUser.status === "online" && (
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
            {chat.otherUser.name || "Usuario Anónimo"}
          </Text>
          <Text
            style={[styles.time, { color: theme.text.secondary }]}
            numberOfLines={1}
          >
            {formatRelativeTime(chat.lastMessage?.timestamp)}
          </Text>
        </View>

        <Text
          style={[styles.message, { color: theme.text.secondary }]}
          numberOfLines={2}
        >
          {chat.lastMessage?.text || "No hay mensajes"}
        </Text>

        {/* Indicador de mensajes no leídos */}
        {chat.unreadCount > 0 && (
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
        )}
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
