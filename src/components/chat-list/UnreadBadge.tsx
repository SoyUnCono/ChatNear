import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../../contexts/ThemeContext";

interface UnreadBadgeProps {
  count: number;
  theme: Theme;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count, theme }) => {
  if (!count) return null;

  return (
    <View
      style={[styles.unreadBadge, { backgroundColor: theme.action.primary }]}
    >
      <Text style={styles.unreadCount}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
