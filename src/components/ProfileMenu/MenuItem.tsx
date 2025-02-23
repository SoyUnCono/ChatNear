import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

////
/// Tipos
////
interface MenuItemProps {
  ///
  /// Icono
  ///
  icon: keyof typeof Ionicons.glyphMap;

  ///
  /// Etiqueta
  ///
  label: string;

  ///
  /// Presionar
  ///
  onPress: () => void;

  ///
  /// Seleccionado
  ///
  isSelected?: boolean;

  ///
  /// Color
  ///
  color?: string;
}

////
/// Componente de menú de perfil
////
export const MenuItem: React.FC<MenuItemProps> = ({
  ///
  /// Icono
  ///
  icon,

  ///
  /// Etiqueta
  ///
  label,

  ///
  /// Presionar
  ///
  onPress,

  ///
  /// Seleccionado
  ///
  isSelected,

  ///
  /// Color
  ///
  color,
}) => {
  ////
  /// Tema
  ///
  const { theme } = useTheme();

  ////
  /// Renderizado
  ///
  return (
    <TouchableOpacity
      style={[
        styles.option,
        isSelected && { backgroundColor: theme.background.secondary },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={color || theme.icon.primary}
        style={styles.icon}
      />
      <Text style={[styles.label, { color: color || theme.text.primary }]}>
        {label}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color={theme.action.primary} />
      )}
    </TouchableOpacity>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
});
