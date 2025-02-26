import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { NotificationsScreen } from "../screens/notifications/NotificationsScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { useTheme } from "../contexts/ThemeContext";
import { MainStackParamList } from "./types";

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background.secondary,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerLargeTitle: true,
        headerLargeTitleStyle: {
          color: theme.text.primary,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Chats",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Ajustes",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Notificaciones",
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerLargeTitle: false,
        }}
      />
    </Stack.Navigator>
  );
};
