import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../../contexts/ThemeContext";
import { User, Chat } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

interface FloatingHeaderProps {
  otherUser: User | null;
  chat: Chat | null;
  onEndChat: () => void;
  theme: Theme;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  otherUser,
  chat,
  onEndChat,
  theme,
}) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    if (otherUser) {
      (navigation as any).navigate("UserProfile", { userId: otherUser.id });
    }
  };

  const isTyping = chat?.participants?.find(
    (p) => p.user_id === otherUser?.id
  )?.is_typing;

  const isOnline = otherUser?.status === "online";

  return (
    <BlurView intensity={80} tint="dark" style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            {otherUser?.avatar_url ? (
              <Image
                source={{ uri: otherUser.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.background.tertiary },
                ]}
              >
                <Text
                  style={[styles.avatarText, { color: theme.text.primary }]}
                >
                  {otherUser?.username?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {isOnline && (
              <View
                style={[
                  styles.onlineIndicator,
                  { backgroundColor: theme.status.success },
                ]}
              />
            )}
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.username, { color: theme.text.primary }]}>
              {otherUser?.username || "Usuario"}
            </Text>
            <Text
              style={[
                styles.status,
                {
                  color: isTyping ? theme.status.success : theme.text.secondary,
                },
              ]}
            >
              {isTyping
                ? "Escribiendo..."
                : isOnline
                ? "En línea"
                : "Desconectado"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            <Ionicons
              name="chevron-down"
              size={24}
              color={theme.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEndChat} style={styles.actionButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={theme.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  status: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
