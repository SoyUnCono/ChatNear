import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../contexts/ThemeContext";
import { User } from "../../types";

interface UserInfoProps {
  user: User;
  theme: Theme;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, theme }) => {
  return (
    <View style={styles.userInfo}>
      {user?.avatar_url ? (
        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      ) : (
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.background.secondary },
          ]}
        >
          <Ionicons name="person" size={30} color={theme.text.secondary} />
        </View>
      )}
      <Text style={[styles.username, { color: theme.text.primary }]}>
        {user?.username ? `@${user.username}` : "Usuario"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
});
