import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MainStackParamList } from "../navigation/types";

type ProfileScreenRouteProp = RouteProp<MainStackParamList, "Profile">;

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ProfileScreenRouteProp>();
  const { userId } = route.params;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Perfil de Usuario
        </Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          ID: {userId}
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
