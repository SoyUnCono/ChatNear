import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeSelector } from "./ThemeSelector";
import { MenuItem } from "./MenuItem";

////
/// Tipos
////
interface ProfileMenuProps {
  ///
  /// Visible
  ///
  visible: boolean;

  ///
  /// Cerrar
  ///
  onClose: () => void;
}

////
/// Componente de menú de perfil
////
export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  ///
  /// Visible
  ///
  visible,

  ///
  /// Cerrar
  ///
  onClose,
}) => {
  ////
  /// Tema
  ///
  const { theme, setThemeMode } = useTheme();

  ////
  /// Cerrar sesión
  ///
  const { signOut } = useAuth();

  ////
  /// Cambiar el tema
  ///
  const handleThemeChange = async (mode: "light" | "dark" | "system") => {
    ////
    /// Cambiar el tema
    ///
    await setThemeMode(mode);

    ////
    /// Cerrar el menú
    ///
    onClose();
  };

  ////
  /// Cerrar sesión
  ///
  const handleSignOut = async () => {
    ////
    /// Cerrar sesión
    ///
    await signOut();

    ////
    /// Cerrar el menú
    ///
    onClose();
  };

  ////
  /// Renderizado
  ///
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: theme.background.primary,
              borderColor: theme.border.primary,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Ajustes
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.icon.primary} />
            </TouchableOpacity>
          </View>

          {/* Theme Selector */}
          <ThemeSelector onThemeChange={handleThemeChange} />

          {/* Sign Out Button */}
          <MenuItem
            icon="log-out"
            label="Cerrar Sesión"
            onPress={handleSignOut}
            color={theme.status.error}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
});
