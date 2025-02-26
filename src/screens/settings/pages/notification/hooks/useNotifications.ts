import { useState, useEffect } from "react";
import { Platform } from "react-native";
import {
  notificationSettings,
  NotificationSettings,
} from "../../../../../services/notifications/settings";

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    soundEnabled: true,
    messagePreview: true,
    newChatsEnabled: true,
    groupEnabled: true,
    mentionsEnabled: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await notificationSettings.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const updateSetting = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await notificationSettings.updateSettings({ [key]: value });

      if (key === "pushEnabled") {
        if (value) {
          const success =
            await notificationSettings.registerForPushNotifications();
          if (!success) {
            // Revert the change if registration fails
            setSettings(settings);
            await notificationSettings.updateSettings({ pushEnabled: false });
          }
        }
      }

      if (key === "soundEnabled") {
        await notificationSettings.updateNotificationChannel(value);
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      // Revert the change if there's an error
      setSettings(settings);
    }
  };

  return {
    settings,
    updateSetting,
  };
};
