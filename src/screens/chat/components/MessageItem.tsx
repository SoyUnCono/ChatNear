import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { Theme } from "../../../contexts/ThemeContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Message, User } from "../../../types";
import { Ionicons } from "@expo/vector-icons";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  theme: Theme;
  sender: User | null;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwnMessage,
  theme,
  sender,
}) => {
  const renderAvatar = () => {
    return (
      <View style={styles.avatarContainer}>
        {sender?.avatar_url ? (
          <Image
            source={{ uri: sender.avatar_url }}
            style={styles.avatar}
            defaultSource={require("../../../assets/default-avatar.png")}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.background.tertiary },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.text.primary }]}>
              {sender?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderMessageStatus = () => {
    // Por defecto, asumimos que el mensaje está enviado a menos que se indique lo contrario
    const isSent = message.sent !== false;

    if (message.read) {
      return (
        <Ionicons
          name="checkmark-done"
          size={14}
          color={isOwnMessage ? theme.status.success : theme.text.secondary}
          style={styles.statusIcon}
        />
      );
    }

    if (isSent) {
      return (
        <Ionicons
          name="checkmark"
          size={14}
          color={theme.text.secondary}
          style={styles.statusIcon}
        />
      );
    }

    return (
      <Ionicons
        name="time-outline"
        size={14}
        color={theme.text.secondary}
        style={styles.statusIcon}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage
          ? styles.ownMessageContainer
          : styles.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageContent,
          isOwnMessage
            ? [styles.ownMessage, { backgroundColor: theme.action.primary }]
            : [
                styles.otherMessage,
                { backgroundColor: theme.background.secondary },
              ],
          Platform.select({
            ios: {
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
            },
            android: {
              elevation: 2,
            },
          }),
        ]}
      >
        <View style={styles.messageHeader}>
          {renderAvatar()}
          <Text
            style={[
              styles.senderName,
              {
                color: isOwnMessage ? theme.text.contrast : theme.text.primary,
              },
            ]}
            numberOfLines={1}
          >
            {sender?.username || "Usuario"}
          </Text>
        </View>

        {message.image_url && (
          <Image
            source={{ uri: message.image_url }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        {message.content && (
          <Text
            style={[
              styles.messageText,
              {
                color: isOwnMessage ? theme.text.contrast : theme.text.primary,
              },
            ]}
          >
            {message.content}
          </Text>
        )}
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timeText,
              {
                color: isOwnMessage
                  ? theme.text.contrast
                  : theme.text.secondary,
              },
            ]}
          >
            {format(new Date(message.created_at), "HH:mm", { locale: es })}
          </Text>
          {renderMessageStatus()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  messageContent: {
    maxWidth: "85%",
    minWidth: 160,
    borderRadius: 16,
    padding: 10,
    paddingBottom: 6,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  ownMessage: {
    borderTopRightRadius: 2,
  },
  otherMessage: {
    borderTopLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginHorizontal: 2,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    marginBottom: 2,
    opacity: 0.9,
  },
  timeText: {
    fontSize: 11,
    marginRight: 3,
  },
  statusIcon: {
    marginLeft: 1,
  },
  avatarContainer: {
    width: 20,
    height: 20,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 9,
    fontWeight: "600",
  },
  messageImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 6,
  },
});
