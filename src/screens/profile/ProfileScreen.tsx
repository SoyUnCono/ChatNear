import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/types";
import { Header } from "../../components/Header/Header";

///
/// Props
///
type ProfileScreenRouteProp = RouteProp<MainStackParamList, "Profile">;

///
/// ProfileScreen
///
export const ProfileScreen: React.FC = () => {
  ///
  /// Tema
  ///
  const { theme } = useTheme();

  ///
  /// Ruta
  ///
  const route = useRoute<ProfileScreenRouteProp>();

  ///
  /// Navegación
  ///
  const navigation = useNavigation();

  ///
  /// Usuario ID
  ///
  const { userId } = route.params;

  ///
  /// Configurar el header
  ///
  useLayoutEffect(() => {
    ///
    /// Configurar el header
    ///
    navigation.setOptions({
      ///
      /// Header
      ///
      header: () => (
        <Header
          title="Perfil"
          backIcon="arrow-back" // Aquí usamos un icono diferente al de settings
          backTitle="Atrás" // Y un título de regreso diferente
          isSettingsStyle={false} // Importante: NO usamos el estilo de settings
        />
      ),

      ///
      /// Header visible
      ///
      headerShown: true,
    });
  }, [navigation]);

  ///
  /// Renderizado
  ///
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.content, { backgroundColor: "transparent" }]}>
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
