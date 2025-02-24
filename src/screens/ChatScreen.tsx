import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../navigation/types";

type ChatScreenRouteProp = RouteProp<MainStackParamList, "Chat">;

export const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Chat ID: {chatId}
        </Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          Aquí irá la implementación del chat
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});
