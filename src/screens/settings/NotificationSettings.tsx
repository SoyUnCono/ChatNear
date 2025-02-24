import React from "react";
import { ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Section } from "./components/Section";
import { SwitchItem } from "./components/SwitchItem";
import { SettingsHeader } from "./components/SettingsHeader";
import { useNotificationSettings } from "./hooks/useNotificationSettings";

////
/// Componente : Ajustes de notificaciones
////
export const NotificationSettings: React.FC = () => {
  ///
  /// Tema
  ///
  const { theme, isDarkMode } = useTheme();

  ///
  /// Ajustes de notificaciones
  ///
  const { settings, updateSetting } = useNotificationSettings();

  ////
  /// Renderizado
  ////
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background.primary }}
      edges={["bottom"]}
    >
      <StatusBar
        backgroundColor={theme.background.primary}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <SettingsHeader title="Notificaciones" />

      <ScrollView style={{ flex: 1 }}>
        <Section title="NOTIFICACIONES PUSH">
          <SwitchItem
            title="Permitir notificaciones"
            subtitle="Recibe notificaciones de mensajes y actividad"
            value={settings.pushEnabled}
            onValueChange={(value) => updateSetting("pushEnabled", value)}
            icon="notifications-outline"
          />
          <SwitchItem
            title="Sonidos"
            value={settings.soundEnabled}
            onValueChange={(value) => updateSetting("soundEnabled", value)}
            icon="volume-high-outline"
          />
          <SwitchItem
            title="Vista previa de mensajes"
            subtitle="Muestra el contenido del mensaje en las notificaciones"
            value={settings.messagePreview}
            onValueChange={(value) => updateSetting("messagePreview", value)}
            icon="eye-outline"
          />
        </Section>

        <Section title="TIPOS DE NOTIFICACIONES">
          <SwitchItem
            title="Nuevos chats"
            value={settings.newChatsEnabled}
            onValueChange={(value) => updateSetting("newChatsEnabled", value)}
            icon="chatbubble-outline"
          />
          <SwitchItem
            title="Chats grupales"
            value={settings.groupEnabled}
            onValueChange={(value) => updateSetting("groupEnabled", value)}
            icon="people-outline"
          />
          <SwitchItem
            title="Menciones"
            value={settings.mentionsEnabled}
            onValueChange={(value) => updateSetting("mentionsEnabled", value)}
            icon="at-circle-outline"
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};
