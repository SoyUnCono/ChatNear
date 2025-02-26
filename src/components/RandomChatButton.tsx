import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

////
/// Tipos
////
interface RandomChatButtonProps {
  ///
  /// Texto del botón
  ///
  label: string;

  ///
  /// Evento: Presionar
  ///
  onPress: () => void;

  ///
  /// Variante del botón
  ///
  variant?: "primary" | "secondary";

  ///
  /// Deshabilitado
  ///
  disabled?: boolean;
}

////
/// Componente : Botón para iniciar un chat aleatorio
////
export const RandomChatButton: React.FC<RandomChatButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}) => {
  ////
  /// Tema
  ///
  const { theme } = useTheme();

  ////
  /// Renderizado
  ////
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor:
            variant === "primary" ? theme.action.primary : "transparent",
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: "white",
          opacity: disabled ? 0.5 : 1,
          ...Platform.select({
            ios: {
              shadowColor: theme.action.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: variant === "primary" ? 0.3 : 0,
              shadowRadius: 8,
            },
            android: {
              elevation: variant === "primary" ? 8 : 0,
            },
          }),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Ionicons
        name="people"
        size={24}
        color={variant === "primary" ? "white" : theme.action.primary}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          { color: variant === "primary" ? "white" : theme.action.primary },
        ]}
      >
        {label}
      </Text>
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
    fontSize: 16,
    fontWeight: "600",
  },
});
