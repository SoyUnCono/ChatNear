import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../../contexts/ThemeContext";
import { Message, User } from "../../types";
import { formatRelativeTime } from "../../utils/date";
import { UnreadBadge } from "./UnreadBadge";
import { Ionicons } from "@expo/vector-icons";

interface ChatContentProps {
  otherUser?: User;
  lastMessage?: Message;
  unreadCount: number;
  isAnonymous: boolean;
  theme: Theme;
}

export const ChatContent: React.FC<ChatContentProps> = ({
  otherUser,
  lastMessage,
  unreadCount,
  isAnonymous,
  theme,
}) => {
  const getDisplayName = () => {
    if (!otherUser) return "Usuario";

    if (otherUser.username) {
      return `@${otherUser.username}`;
    }

    if (otherUser.name) {
      return otherUser.name;
    }

    return isAnonymous ? "Usuario Anónimo" : "Usuario";
  };

  const renderLastMessage = () => {
    if (!lastMessage) return null;

    let content = lastMessage.content;
    const hasImage = !!lastMessage.image_url;

    if (hasImage) {
      content = content ? "📷 " + content : "📷 Imagen";
    }

    return (
      <View style={styles.messageContainer}>
        {hasImage && (
          <Ionicons
            name="image-outline"
            size={16}
            color={theme.text.secondary}
            style={styles.imageIcon}
          />
        )}
        <Text
          style={[styles.message, { color: theme.text.secondary }]}
          numberOfLines={2}
        >
          {content}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[styles.name, { color: theme.text.primary }]}
          numberOfLines={1}
        >
          {getDisplayName()}
        </Text>
        {lastMessage && (
          <Text style={[styles.time, { color: theme.text.tertiary }]}>
            {formatRelativeTime(lastMessage.created_at)}
          </Text>
        )}
      </View>

      {renderLastMessage()}
      <UnreadBadge count={unreadCount} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageIcon: {
    marginRight: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
