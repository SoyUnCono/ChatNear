import { useState } from "react";

////
/// Tipos
////
export interface NotificationSettings {
  ///
  /// Notificaciones push
  ///
  pushEnabled: boolean;

  ///
  /// Sonidos
  ///
  soundEnabled: boolean;

  ///
  /// Vista previa de mensajes
  ///
  messagePreview: boolean;

  ///
  /// Nuevos chats
  ///
  newChatsEnabled: boolean;

  ///
  /// Chats grupales
  ///
  groupEnabled: boolean;

  ///
  /// Menciones
  ///
  mentionsEnabled: boolean;
}

////
/// Hook : Ajustes de notificaciones
////
export const useNotificationSettings = () => {
  ///
  /// Estado : Ajustes de notificaciones
  ///
  const [settings, setSettings] = useState<NotificationSettings>({
    ///
    /// Notificaciones push
    ///
    pushEnabled: true,

    ///
    /// Sonidos
    ///
    soundEnabled: false,

    ///
    /// Vista previa de mensajes
    ///
    messagePreview: true,

    ///
    /// Nuevos chats
    ///
    newChatsEnabled: true,

    ///
    /// Chats grupales
    ///
    groupEnabled: false,

    ///
    /// Menciones
    ///
    mentionsEnabled: true,
  });

  ///
  /// Actualizar ajuste
  ///
  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    ///
    /// Actualizar ajuste
    ///
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  ///
  /// Retornar ajustes
  ///
  return {
    settings,
    updateSetting,
  };
};
