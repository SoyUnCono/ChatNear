import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
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
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  ////
  /// Manejar el clic en el perfil
  ////
  const handleProfilePress = () => {
    ////
    /// Mostrar el menú
    ////
    setIsMenuVisible(true);
  };

  ////
  /// Manejar el clic en el chat aleatorio
  ////
  const handleRandomChatPress = () => {
    ////
    /// Navegar al chat aleatorio
    ////
    navigation.navigate("RandomChat");
  };

  ////
  /// Manejar el clic en las notificaciones
  ////
  const handleNotificationsPress = () => {
    ////
    /// Navegar a las notificaciones
    ////
    navigation.navigate("Notifications");
  };

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
          {/* Avatar del usuario */}
          <TouchableOpacity
            onPress={handleProfilePress}
            style={styles.avatarContainer}
          >
            {/* Avatar del usuario */}
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
            {/* Indicador de estado online */}
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
          </TouchableOpacity>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            {/* Notificaciones */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotificationsPress}
            >
              {/* Icono de notificaciones */}
              <Ionicons
                name="notifications"
                size={24}
                color={HeaderColors.icon}
              />
              {/* Indicador de notificaciones pendientes */}
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: HeaderColors.badge },
                ]}
              />
            </TouchableOpacity>

            {/* Chat Aleatorio */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                styles.randomChatButton,
                { backgroundColor: HeaderColors.icon },
              ]}
              onPress={handleRandomChatPress}
            >
              {/* Icono de chat aleatorio */}
              <Ionicons name="add" size={26} color={HeaderColors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Menú de perfil */}
      <ProfileMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
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
  avatarContainer: {
    position: "relative",
    padding: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  randomChatButton: {
    borderRadius: 22,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
