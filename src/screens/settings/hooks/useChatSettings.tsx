import { useState } from "react";

////
/// Hook : Ajustes de chat
////
export const useChatSettings = () => {
  ///
  /// Estado : Ajustes de chat
  ///
  const [settings, setSettings] = useState<{
    ///
    /// Distancia en km
    ///
    distance_km: number;

    ///
    /// Modo anónimo
    ///
    anonymous_mode: boolean;

    ///
    /// Lectura de recibos
    ///
    read_receipts: boolean;

    ///
    /// Indicador de escritura
    ///
    typing_indicator: boolean;
  }>({
    ///
    /// Distancia en km
    ///
    distance_km: 30,

    ///
    /// Modo anónimo
    ///
    anonymous_mode: false,

    ///
    /// Lectura de recibos
    ///
    read_receipts: true,

    ///
    /// Indicador de escritura
    ///
    typing_indicator: true,
  });

  ///
  /// Actualizar ajuste
  ///
  const updateSetting = <K extends keyof typeof settings>(
    ///
    /// Clave
    ///
    key: K,

    ///
    /// Valor
    ///
    value: (typeof settings)[K]
  ) => {
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
    ///
    /// Ajustes
    ///
    settings,

    ///
    /// Actualizar ajuste
    ///
    updateSetting,
  };
};
