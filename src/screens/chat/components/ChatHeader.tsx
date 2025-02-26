import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChatHeaderProps } from "../types";
import { styles } from "../styles";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  otherUser,
  chat,
  onEndChat,
  theme,
}) => {
  if (!otherUser || !chat) return null;

  return (
    <View style={styles.headerTitle}>
      {otherUser.avatar_url ? (
        <Image
          source={{ uri: otherUser.avatar_url }}
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
          <Ionicons name="person" size={20} color={theme.icon.secondary} />
        </View>
      )}
      <View style={styles.headerInfo}>
        <Text style={[styles.headerName, { color: theme.text.primary }]}>
          {chat.is_anonymous
            ? "Usuario Anónimo"
            : otherUser.username || "Usuario"}
        </Text>
        {otherUser.status === "online" && (
          <Text style={[styles.headerStatus, { color: theme.status.success }]}>
            En línea
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onEndChat}>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={theme.action.primary}
        />
      </TouchableOpacity>
    </View>
  );
};
