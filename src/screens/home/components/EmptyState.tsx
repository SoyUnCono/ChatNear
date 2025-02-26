import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";

interface EmptyStateProps {
  locationError?: string | null;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ locationError }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={theme.icon.secondary}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.text.primary }]}>
        No hay chats activos
      </Text>
      <Text style={[styles.text, { color: theme.text.secondary }]}>
        ¡Inicia un chat aleatorio para comenzar a conocer gente nueva!
      </Text>
      {locationError && (
        <Text style={[styles.error, { color: theme.status.error }]}>
          {locationError}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
