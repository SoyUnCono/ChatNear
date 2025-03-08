import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";

export const PrivacySettings: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.content, { backgroundColor: "transparent" }]}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Privacidad
        </Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          Configura tus ajustes de privacidad
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
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
