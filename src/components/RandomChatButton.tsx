import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

////
/// Componente : Botón para iniciar un chat aleatorio
////
export const RandomChatButton: React.FC = () => {
  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Tema
  ///
  const { theme } = useTheme();

  ////
  /// Evento : Iniciar chat aleatorio
  ////
  const handlePress = () => {
    ////
    /// Navegar al chat aleatorio
    ////
    navigation.navigate("Chat", { chatId: "random" });
  };

  ////
  /// Renderizado
  ////
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.action.primary,
          ...Platform.select({
            ios: {
              shadowColor: theme.action.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons name="people" size={24} color="white" style={styles.icon} />
      <Text style={styles.text}>Nuevo Chat</Text>
    </TouchableOpacity>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
