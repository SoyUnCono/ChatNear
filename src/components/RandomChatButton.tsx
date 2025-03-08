import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
} from "react-native";
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

  ///
  /// Estilos adicionales del contenedor
  ///
  containerStyle?: ViewStyle;
}

////
/// Componente : Botón para iniciar un chat aleatorio
////
export const RandomChatButton: React.FC<RandomChatButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  containerStyle,
}) => {
  ////
  /// Tema
  ///
  const { theme } = useTheme();

  const buttonStyle = {
    backgroundColor: variant === "primary" ? theme.action.primary : "white",
    borderWidth: variant === "secondary" ? 0 : 0,
    opacity: disabled ? 0.5 : 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.action.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  };

  const textColor = variant === "primary" ? "white" : theme.action.primary;

  ////
  /// Renderizado
  ////
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, containerStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Ionicons
        name={variant === "primary" ? "people" : "close-circle"}
        size={24}
        color={textColor}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
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
    borderRadius: 16,
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
    fontWeight: "700",
  },
});
