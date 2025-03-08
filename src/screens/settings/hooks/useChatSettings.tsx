import { useState, useEffect, useCallback } from "react";
import { chatSettings, ChatSettings } from "../../../services/chat/settings";

////
/// Hook : Ajustes de chat
////
export const useChatSettings = () => {
  ///
  /// Estado : Ajustes de chat
  ///
  const [settings, setSettings] = useState<ChatSettings>({
    distance_km: 30,
    anonymous_mode: false,
    read_receipts: true,
    typing_indicator: true,
    age_range: {
      min: 18,
      max: 99,
    },
    gender_filter: "all",
    friends_of_friends_only: false,
    min_common_interests: 0,
  });

  ///
  /// Estado : Ajustes pendientes
  ///
  const [pendingSettings, setPendingSettings] = useState<Partial<ChatSettings>>(
    {}
  );

  ///
  /// Cargar ajustes al montar el componente
  ///
  useEffect(() => {
    loadSettings();
  }, []);

  ///
  /// Efecto para manejar el debounce de actualizaciones
  ///
  useEffect(() => {
    if (Object.keys(pendingSettings).length === 0) return;

    const timer = setTimeout(async () => {
      try {
        await chatSettings.updateSettings(pendingSettings);
        setSettings((prev) => ({
          ...prev,
          ...pendingSettings,
        }));
        setPendingSettings({});
      } catch (error) {
        console.error("Error updating chat settings:", error);
      }
    }, 1000); // 1000ms de debounce

    return () => clearTimeout(timer);
  }, [pendingSettings]);

  ///
  /// Cargar ajustes
  ///
  const loadSettings = async () => {
    try {
      const savedSettings = await chatSettings.getSettings();
      // Asegurarse de que age_range tenga valores válidos
      const validatedSettings = {
        ...savedSettings,
        age_range: savedSettings.age_range || { min: 18, max: 99 },
      };
      setSettings(validatedSettings);
    } catch (error) {
      console.error("Error loading chat settings:", error);
    }
  };

  ///
  /// Actualizar ajuste
  ///
  const updateSetting = useCallback(
    <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
      // Validar el valor de age_range
      if (key === "age_range" && (!value || typeof value !== "object")) {
        value = { min: 18, max: 99 } as ChatSettings[K];
      }

      // Actualizar inmediatamente el estado local para UI responsiva
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Agregar a pendingSettings para el debounce
      setPendingSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  ///
  /// Retornar ajustes
  ///
  return {
    settings,
    updateSetting,
  };
};
