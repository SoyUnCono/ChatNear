import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/types";
import { Header } from "../../components/Header/Header";

type ProfileScreenRouteProp = RouteProp<MainStackParamList, "Profile">;

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation();
  const { userId } = route.params;

  // Configurar el header
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title="Perfil"
          backIcon="arrow-back" // Aquí usamos un icono diferente al de settings
          backTitle="Atrás" // Y un título de regreso diferente
          isSettingsStyle={false} // Importante: NO usamos el estilo de settings
        />
      ),
      headerShown: true,
    });
  }, [navigation]);

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
