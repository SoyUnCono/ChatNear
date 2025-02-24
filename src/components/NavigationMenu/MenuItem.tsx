import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { MenuItemProps } from "./types";
import { getMenuItemDescription } from "./constants";

///
/// Componente MenuItem
///
export const MenuItem: React.FC<MenuItemProps> = ({
  ///
  /// Item
  ///
  item,

  ///
  /// Evento: Navegar
  ///
  onNavigate,

  ///
  /// Estado: Modo oscuro
  ///
  isDarkMode,
}) => {
  ///
  /// Tema
  ///
  const { theme } = useTheme();

  ///
  /// Renderizado
  ///
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
      onPress={() => onNavigate(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.08)",
          },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={22}
          color={isDarkMode ? theme.text.primary : theme.text.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.menuItemText, { color: theme.text.primary }]}>
          {item.label}
        </Text>
        <Text
          style={[styles.menuItemDescription, { color: theme.text.secondary }]}
        >
          {getMenuItemDescription(item.name)}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

///
/// Estilos
///
const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  menuItemDescription: {
    fontSize: 13,
    opacity: 0.7,
    letterSpacing: -0.1,
  },
  chevron: {
    marginLeft: 8,
  },
});
