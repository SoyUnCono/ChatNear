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
import { ActivityIndicator, View } from "react-native";
import { Header } from "../components/Header";
import { NavigationMenu } from "../components/NavigationMenu/index";
import { RandomChatProvider } from "../contexts/RandomChatContext";
import React from "react";
import { useNotificationResponse } from "../hooks/useNotificationResponse";
import * as Notifications from "expo-notifications";

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
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          header: () => <Header />,
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
        />
        <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
        <Stack.Screen name="SecuritySettings" component={SecuritySettings} />
        <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
        <Stack.Screen name="RegionSettings" component={RegionSettings} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
      <NavigationMenu visible={false} onClose={() => {}} />
    </>
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

  ///
  /// Si está cargando los datos del usuario o no hay usuario, mostrar un
  /// indicador de carga
  ///
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
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
        {user ? <MainNavigator /> : <AuthNavigator />}
      </RandomChatProvider>
    </NavigationContainer>
  );
}
