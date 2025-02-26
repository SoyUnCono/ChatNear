import { SettingsStorage } from "../storage/settings";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

///
/// Configuración de notificaciones
///
export interface NotificationSettings {
  ///
  /// Notificación de push
  ///
  pushEnabled: boolean;
  ///
  /// Notificación de sonido
  ///
  soundEnabled: boolean;
  ///
  /// Notificación de vista previa de mensaje
  ///
  messagePreview: boolean;
  ///
  /// Notificación de nuevos chats
  ///
  newChatsEnabled: boolean;
  ///
  /// Notificación de grupos
  ///
  groupEnabled: boolean;
  ///
  /// Notificación de menciones
  ///
  mentionsEnabled: boolean;
}

///
/// Configuración por defecto
///
const DEFAULT_SETTINGS: NotificationSettings = {
  ///
  /// Notificación de push
  ///
  pushEnabled: false,
  ///
  /// Notificación de sonido
  ///
  soundEnabled: true,
  ///
  /// Notificación de vista previa de mensaje
  ///
  messagePreview: true,
  ///
  /// Notificación de nuevos chats
  ///
  newChatsEnabled: true,
  ///
  /// Notificación de grupos
  ///
  groupEnabled: true,
  ///
  /// Notificación de menciones
  ///
  mentionsEnabled: true,
};

///
/// Servicio de configuración de notificaciones
///
class NotificationSettingsService {
  ///
  /// Almacenamiento de configuración
  ///
  private storage: SettingsStorage<NotificationSettings>;
  ///
  /// ProjectId
  ///
  private projectId: string;

  ///
  /// Constructor
  ///
  constructor() {
    ///
    /// Almacenamiento de configuración
    ///
    this.storage = new SettingsStorage<NotificationSettings>(
      "@notification_settings",
      DEFAULT_SETTINGS
    );

    ///
    /// Obtener el projectId desde la configuración extra
    ///
    this.projectId = Constants.expoConfig?.extra?.eas?.projectId || "";

    ///
    /// Si no se encuentra el projectId, mostrar un mensaje de advertencia
    ///
    if (!this.projectId) {
      console.warn("No projectId found in app.config.js extra.eas.projectId");
    }

    ///
    /// Configurar el handler de notificaciones
    ///
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  ///
  /// Obtener la configuración
  ///
  async getSettings(): Promise<NotificationSettings> {
    ///
    /// Retornar la configuración
    ///
    return await this.storage.load();
  }

  ///
  /// Actualizar la configuración
  ///
  async updateSettings(settings: Partial<NotificationSettings>): Promise<void> {
    ///
    /// Actualizar la configuración
    ///
    await this.storage.save(settings);
  }

  ///
  /// Registrar para notificaciones de push
  ///
  async registerForPushNotifications(): Promise<boolean> {
    ///
    /// Si no es un dispositivo físico, retornar false
    ///
    if (!Device.isDevice) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.log("Push notifications require a physical device");
      ///
      /// Retornar false
      ///
      return false;
    }

    ///
    /// Intentar registrar para notificaciones de push
    ///
    try {
      ///
      /// Obtener el estado actual de las notificaciones
      ///
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      ///
      /// Obtener el estado final de las notificaciones
      ///
      let finalStatus = existingStatus;

      ///
      /// Si el estado actual no es "granted", solicitar permisos
      ///
      if (existingStatus !== "granted") {
        ///
        /// Solicitar permisos
        ///
        const { status } = await Notifications.requestPermissionsAsync();
        ///
        finalStatus = status;
      }

      ///
      /// Si el estado final no es "granted", mostrar un mensaje de advertencia y retornar false
      ///
      if (finalStatus !== "granted") {
        ///
        /// Mostrar un mensaje de advertencia
        ///
        console.log("Failed to get push notification permissions");
        ///
        return false;
      }

      ///
      /// Configurar el canal de notificaciones para Android
      ///
      if (Platform.OS === "android") {
        ///
        /// Configurar el canal de notificaciones
        ///
        await Notifications.setNotificationChannelAsync("default", {
          ///
          /// Nombre del canal
          ///
          name: "default",
          ///
          /// Importancia del canal
          ///
          importance: Notifications.AndroidImportance.MAX,
          ///
          /// Patrón de vibración
          ///
          vibrationPattern: [0, 250, 250, 250],
          ///
          /// Color de la luz
          ///
          lightColor: "#FF231F7C",
          ///
          /// Habilitar vibración
          ///
          enableVibrate: true,
          ///
          /// Habilitar luces
          ///
          enableLights: true,
        });
      }

      ///
      /// Si estamos en desarrollo, enviar una notificación de prueba
      ///
      if (__DEV__) {
        ///
        /// Enviar una notificación de prueba
        ///
        await this.sendTestNotification();
        ///
        /// Retornar true
        ///
        return true;
      }

      ///
      /// Si no se encuentra el projectId, mostrar un mensaje de advertencia y retornar false
      ///
      if (!this.projectId) {
        ///
        /// Mostrar un mensaje de advertencia
        ///
        throw new Error(
          "ProjectId not configured in app.config.js extra.eas.projectId"
        );
      }

      ///
      /// Obtener el token de push
      ///
      const token = await Notifications.getExpoPushTokenAsync({
        ///
        /// ProjectId
        ///
        projectId: this.projectId,
      });
      ///
      /// Mostrar el token de push
      ///
      console.log("Push Notification Token:", token);
      ///
      /// Retornar true
      ///
      return true;
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error("Error registering for notifications:", error);
      ///
      /// Retornar false
      ///
      return false;
    }
  }

  ///
  /// Actualizar el canal de notificaciones
  ///
  async updateNotificationChannel(soundEnabled: boolean): Promise<void> {
    ///
    /// Si estamos en Android, actualizar el canal de notificaciones
    ///
    if (Platform.OS === "android") {
      ///
      /// Actualizar el canal de notificaciones
      ///
      await Notifications.setNotificationChannelAsync("default", {
        ///
        /// Nombre del canal
        ///
        name: "default",
        ///
        /// Importancia del canal
        ///
        importance: soundEnabled
          ? Notifications.AndroidImportance.MAX
          : Notifications.AndroidImportance.DEFAULT,
        ///
        /// Patrón de vibración
        ///
        vibrationPattern: [0, 250, 250, 250],
        ///
        /// Color de la luz
        ///
        lightColor: "#FF231F7C",
        ///
        /// Habilitar vibración
        ///
        enableVibrate: soundEnabled,
        ///
        /// Habilitar luces
        ///
        enableLights: true,
        ///
        /// Sonido del canal
        ///
        sound: soundEnabled ? "default" : null,
      });
    }
  }

  ///
  /// Enviar una notificación de prueba
  ///
  async sendTestNotification() {
    ///
    /// Enviar una notificación de prueba
    ///
    await Notifications.scheduleNotificationAsync({
      ///
      /// Contenido de la notificación
      ///
      content: {
        ///
        /// Título de la notificación
        ///
        title: "Prueba de notificación",
        ///
        /// Cuerpo de la notificación
        ///
        body: "Esta es una notificación de prueba local",
        ///
        /// Datos de la notificación
        ///
        data: { type: "test" },
      },
      ///
      /// Trigger de la notificación || Null Para notificaciones instantáneas
      ///
      trigger: null,
    });
  }
}

///
/// Servicio de configuración de notificaciones
///
export const notificationSettings = new NotificationSettingsService();
