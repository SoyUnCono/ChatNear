import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { MenuItem } from "./MenuItem";

////
/// Tipos
////
interface ThemeSelectorProps {
  ///
  /// Cambiar el tema
  ///
  onThemeChange: (mode: "light" | "dark" | "system") => void;
}

////
/// Componente de selector de tema
////
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  ///
  /// Cambiar el tema
  ///
  onThemeChange,
}) => {
  ////
  /// Tema
  ///
  const { theme, themeMode } = useTheme();

  ////
  /// Renderizado
  ///
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
        Tema
      </Text>

      <MenuItem
        icon="sunny"
        label="Claro"
        isSelected={themeMode === "light"}
        onPress={() => onThemeChange("light")}
      />

      <MenuItem
        icon="moon"
        label="Oscuro"
        isSelected={themeMode === "dark"}
        onPress={() => onThemeChange("dark")}
      />

      <MenuItem
        icon="phone-portrait"
        label="Sistema"
        isSelected={themeMode === "system"}
        onPress={() => onThemeChange("system")}
      />
    </View>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
});
