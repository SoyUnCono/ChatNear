import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../contexts/ThemeContext";
import { User } from "../../types";

interface ChatAvatarProps {
  user?: User;
  theme: Theme;
}

export const ChatAvatar: React.FC<ChatAvatarProps> = ({ user, theme }) => {
  const [imageError, setImageError] = useState(false);

  const renderAvatar = () => {
    if (user?.avatar_url && !imageError) {
      return (
        <Image
          source={{
            uri: user.avatar_url,
            cache: "reload",
          }}
          style={styles.avatar}
          defaultSource={require("../../assets/default-avatar.png")}
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <View
        style={[
          styles.avatar,
          styles.placeholderAvatar,
          { backgroundColor: theme.background.secondary },
        ]}
      >
        <Ionicons name="person" size={24} color={theme.text.secondary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderAvatar()}
      {user?.status === "online" && (
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E1E1E1",
  },
  placeholderAvatar: {
    justifyContent: "center",
    alignItems: "center",
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
});
