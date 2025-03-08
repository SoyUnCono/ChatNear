import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, AuthStackParamList } from "./types";
import { HomeScreen } from "../screens/home/HomeScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { FavoritesScreen } from "../screens/favorite/FavoritesScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { NotificationSettings } from "../screens/settings/pages/notification/index";
import { PrivacySettings } from "../screens/settings/pages/PrivacySettings";
import { SecuritySettings } from "../screens/settings/pages/SecuritySettings";
import { LanguageSettings } from "../screens/settings/pages/LanguageSettings";
import { RegionSettings } from "../screens/settings/pages/RegionSettings";
import { EditProfile } from "../screens/settings/pages/EditProfile";
import { ChangePassword } from "../screens/settings/pages/ChangePassword";
import { useAuth } from "../contexts/AuthContext";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Header } from "../components/Header";
import { NavigationMenu } from "../components/NavigationMenu/index";
import { RandomChatProvider } from "../contexts/RandomChatContext";
import React from "react";
import { useNotificationResponse } from "../hooks/useNotificationResponse";
import * as Notifications from "expo-notifications";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { useTheme } from "../contexts/ThemeContext";
import { SearchFiltersScreen } from "../screens/settings/search-filters/SearchFiltersScreen";

////
/// Stack de navegación
////
const Stack = createNativeStackNavigator<RootStackParamList>();

////
/// Stack de navegación de autenticación
////
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

////
/// Navegador de autenticación
////
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent",
        },
        animation: "slide_from_right",
        animationDuration: 200,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

////
/// Navegador principal
////
const MainNavigator = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          header: () => <Header />,
          contentStyle: {
            backgroundColor: "transparent",
          },
          animation: "slide_from_right",
          animationDuration: 200,
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DMs" component={HomeScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="PrivacySettings"
          component={PrivacySettings}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="SecuritySettings"
          component={SecuritySettings}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="LanguageSettings"
          component={LanguageSettings}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="RegionSettings"
          component={RegionSettings}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="SearchFilters"
          component={SearchFiltersScreen}
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack.Navigator>
      <NavigationMenu visible={false} onClose={() => {}} />
    </View>
  );
};

// Configurar el comportamiento por defecto de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Componente que maneja las notificaciones
const NotificationHandler: React.FC = () => {
  useNotificationResponse();
  return null;
};

////
/// Navegación
////
export function Navigation() {
  ///
  /// Estado: Usuario & Cargando
  ///
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  ///
  /// Si está cargando los datos del usuario o no hay usuario, mostrar un
  /// indicador de carga
  ///
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.action.primary} />
      </View>
    );
  }

  ///
  /// Renderizado
  ///
  return (
    <NavigationContainer>
      <NotificationHandler />
      <RandomChatProvider>
        <AnimatedBackground style={styles.container}>
          {user ? <MainNavigator /> : <AuthNavigator />}
        </AnimatedBackground>
      </RandomChatProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
