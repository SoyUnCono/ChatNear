import React, { useLayoutEffect } from "react";
import { ScrollView, StatusBar, Platform, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Section } from "../../components/Section";
import { SwitchItem } from "../../components/SwitchItem";
import { Header } from "../../../../components/Header/Header";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "./hooks/useNotifications";
import { CustomAlert } from "../../../../components/CustomAlert";

////
/// Componente : Ajustes de notificaciones
////
export const NotificationSettings: React.FC = () => {
  ///
  /// Tema
  ///
  const { theme, isDarkMode } = useTheme();

  ///
  /// Opciones de navegación : ==>  Header
  ///
  const navigation = useNavigation();

  ///
  /// Ajustes de notificaciones
  ///
  const { settings, updateSetting } = useNotifications();

  // Configurar el header
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title="Notificaciones"
          isSettingsStyle={true}
          backTitle="Ajustes"
        />
      ),
      headerShown: true,
    });
  }, [navigation]);

  // Manejador para cuando se intenta activar las notificaciones
  const handlePushToggle = async (value: boolean) => {
    if (value) {
      // Si estamos activando las notificaciones, mostrar un diálogo explicativo
      CustomAlert.show({
        title: "Permisos de notificación",
        message:
          "Para recibir notificaciones, necesitamos tu permiso. ¿Deseas activarlas?",
        type: "info",
        buttons: [
          {
            text: "No, gracias",
            style: "cancel",
          },
          {
            text: "Activar",
            onPress: () => updateSetting("pushEnabled", true),
            style: "default",
          },
        ],
      });
    } else {
      // Si estamos desactivando, mostrar opciones según la plataforma
      if (Platform.OS === "ios") {
        CustomAlert.show({
          title: "Desactivar notificaciones",
          message:
            "Para desactivar las notificaciones, necesitas ir a la configuración del sistema",
          type: "warning",
          buttons: [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Ir a Configuración",
              onPress: () => Linking.openSettings(),
              style: "default",
            },
          ],
        });
      } else {
        // En Android podemos desactivar directamente
        updateSetting("pushEnabled", false);
      }
    }
  };

  ////
  /// Renderizado
  ////
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "transparent" }}
      edges={["bottom"]}
    >
      <StatusBar
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
      />

      <ScrollView style={{ flex: 1, backgroundColor: "transparent" }}>
        <Section title="NOTIFICACIONES PUSH">
          <SwitchItem
            title="Permitir notificaciones"
            subtitle="Recibe notificaciones de mensajes y actividad"
            value={settings.pushEnabled}
            onValueChange={handlePushToggle}
            icon="notifications-outline"
          />
          <SwitchItem
            title="Sonidos y vibración"
            subtitle="Reproduce sonidos y vibra al recibir notificaciones"
            value={settings.soundEnabled}
            onValueChange={(value) => updateSetting("soundEnabled", value)}
            icon="volume-high-outline"
            disabled={!settings.pushEnabled}
          />
          <SwitchItem
            title="Vista previa de mensajes"
            subtitle="Muestra el contenido del mensaje en las notificaciones"
            value={settings.messagePreview}
            onValueChange={(value) => updateSetting("messagePreview", value)}
            icon="eye-outline"
            disabled={!settings.pushEnabled}
          />
        </Section>

        <Section title="TIPOS DE NOTIFICACIONES">
          <SwitchItem
            title="Nuevos chats"
            subtitle="Notificar cuando recibes un nuevo mensaje"
            value={settings.newChatsEnabled}
            onValueChange={(value) => updateSetting("newChatsEnabled", value)}
            icon="chatbubble-outline"
            disabled={!settings.pushEnabled}
          />
          <SwitchItem
            title="Chats grupales"
            subtitle="Notificar actividad en chats grupales"
            value={settings.groupEnabled}
            onValueChange={(value) => updateSetting("groupEnabled", value)}
            icon="people-outline"
            disabled={!settings.pushEnabled}
          />
          <SwitchItem
            title="Menciones"
            subtitle="Notificar cuando alguien te menciona"
            value={settings.mentionsEnabled}
            onValueChange={(value) => updateSetting("mentionsEnabled", value)}
            icon="at-circle-outline"
            disabled={!settings.pushEnabled}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};
