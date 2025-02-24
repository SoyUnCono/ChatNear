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

////
/// Componente de encabezado
////
export const Header: React.FC = () => {
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
            },
          ]}
        >
          {/* Sección izquierda: Avatar y nombre de usuario */}
          <TouchableOpacity
            onPress={() => setIsProfileMenuVisible(true)}
            style={styles.leftSection}
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
                  <Ionicons name="person" size={24} color={HeaderColors.icon} />
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
            <Text style={[styles.username, { color: theme.text.secondary }]}>
              {user?.name || "@" + user?.username || "Usuario"}
            </Text>
          </TouchableOpacity>

          {/* Sección derecha: Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.menuButton]}
              onPress={() => setIsNavigationMenuVisible(true)}
            >
              <Ionicons name="menu" size={24} color={theme.icon.primary} />
            </TouchableOpacity>
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
    height: Platform.OS === "ios" ? 56 : 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
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
