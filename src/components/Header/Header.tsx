import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { HeaderHeight, getHeaderColors } from "./constants";
import { RootStackParamList } from "../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { ProfileMenu } from "../ProfileMenu/ProfileMenu";
import { NavigationMenu } from "../NavigationMenu/index";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
  title?: string;
  backIcon?: keyof typeof Ionicons.glyphMap;
  onBackPress?: () => void;
  isSettingsStyle?: boolean;
  backTitle?: string;
}

////
/// Componente de encabezado
////
export const Header: React.FC<HeaderProps> = ({
  title,
  backIcon,
  onBackPress,
  isSettingsStyle = false,
  backTitle = "Atrás",
}) => {
  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Usuario
  ////
  const { user } = useAuth();

  ////
  /// Tema
  ////
  const { theme, isDarkMode } = useTheme();

  ////
  /// Colores del encabezado
  ////
  const HeaderColors = getHeaderColors(theme);

  ////
  /// Estado del menú
  ////
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);

  ////
  /// Estado del modo predeterminado
  ////
  const isDefaultModeEnabled = !isSettingsStyle && !backIcon;

  ///
  /// Estado del menú de navegación
  ///
  const [isNavigationMenuVisible, setIsNavigationMenuVisible] = useState(false);

  ////
  /// Renderizado
  ////
  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Barra de estado */}
        <StatusBar
          backgroundColor={HeaderColors.background}
          barStyle={isDarkMode ? "light-content" : "dark-content"}
        />

        {/* Contenedor del encabezado */}
        <View
          style={[
            styles.container,
            {
              backgroundColor: HeaderColors.background,
              borderBottomColor: HeaderColors.border,
              height: isSettingsStyle
                ? Platform.OS === "android"
                  ? 44
                  : 56
                : Platform.OS === "ios"
                ? 56
                : 64,
            },
          ]}
        >
          {/* Sección izquierda */}
          <View style={styles.leftSection}>
            {isDefaultModeEnabled ? (
              <TouchableOpacity
                onPress={() => setIsProfileMenuVisible(true)}
                style={styles.userInfoContainer}
              >
                <View style={styles.avatarContainer}>
                  {user?.avatar_url ? (
                    <Image
                      source={{ uri: user.avatar_url }}
                      style={styles.avatar}
                      defaultSource={require("../../assets/default-avatar.png")}
                    />
                  ) : (
                    <View
                      style={[
                        styles.avatar,
                        styles.placeholderAvatar,
                        {
                          backgroundColor: HeaderColors.background,
                          borderColor: HeaderColors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={24}
                        color={HeaderColors.icon}
                      />
                    </View>
                  )}
                  {user?.status === "online" && (
                    <View
                      style={[
                        styles.onlineIndicator,
                        {
                          backgroundColor: HeaderColors.online,
                          borderColor: HeaderColors.background,
                        },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[styles.username, { color: theme.text.secondary }]}
                >
                  {user?.name || "@" + user?.username || "Usuario"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.settingsHeader}>
                <TouchableOpacity
                  onPress={onBackPress || (() => navigation.goBack())}
                  style={styles.backButton}
                >
                  <Ionicons
                    name={
                      isSettingsStyle
                        ? "chevron-back"
                        : backIcon || "arrow-back"
                    }
                    size={24}
                    color={theme.action.primary}
                  />
                  {isSettingsStyle && (
                    <Text
                      style={[styles.backText, { color: theme.action.primary }]}
                    >
                      {backTitle}
                    </Text>
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    isSettingsStyle ? styles.settingsTitle : styles.title,
                    { color: theme.text.primary },
                  ]}
                >
                  {title}
                </Text>
              </View>
            )}
          </View>

          {/* Sección derecha: Botones de acción */}
          <View style={styles.actionsContainer}>
            {isDefaultModeEnabled && (
              <TouchableOpacity
                style={[styles.menuButton]}
                onPress={() => setIsNavigationMenuVisible(true)}
              >
                <Ionicons name="menu" size={24} color={theme.icon.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Menú de perfil */}
      <ProfileMenu
        visible={isProfileMenuVisible}
        onClose={() => setIsProfileMenuVisible(false)}
      />

      {/* Menú de navegación */}
      <NavigationMenu
        visible={isNavigationMenuVisible}
        onClose={() => setIsNavigationMenuVisible(false)}
      />
    </>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  settingsHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 44,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  placeholderAvatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  username: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  settingsTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    zIndex: 1,
  },
  backText: {
    fontSize: 17,
    marginLeft: -4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
});
