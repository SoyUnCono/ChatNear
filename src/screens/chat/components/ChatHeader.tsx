import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../../contexts/ThemeContext";
import { User, Chat } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatHeaderProps {
  otherUser: User | null;
  chat: Chat | null;
  onEndChat: () => void;
  theme: Theme;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background.secondary }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={theme.text.primary} />
        </TouchableOpacity>

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
                  {
                    backgroundColor: theme.status.success,
                    borderColor: theme.background.secondary,
                  },
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

        <TouchableOpacity onPress={onEndChat} style={styles.optionsButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.text.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  status: {
    fontSize: 13,
  },
  optionsButton: {
    padding: 8,
  },
});
