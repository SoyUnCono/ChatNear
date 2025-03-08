import AsyncStorage from "@react-native-async-storage/async-storage";

///
/// Servicio de almacenamiento de configuración
///
export class SettingsStorage<T extends object> {
  ///
  /// Clave del almacenamiento
  ///
  private key: string;
  ///
  /// Valores por defecto
  ///
  private defaultSettings: T;

  ///
  /// Constructor
  ///
  constructor(key: string, defaultSettings: T) {
    ///
    /// Asignar la clave del almacenamiento
    ///
    this.key = key;
    ///
    /// Asignar los valores por defecto
    ///
    this.defaultSettings = defaultSettings;
  }

  ///
  /// Obtener la configuración almacenada
  ///
  async getSettings(): Promise<T> {
    try {
      ///
      /// Obtener la configuración almacenada
      ///
      const settings = await AsyncStorage.getItem(this.key);
      ///
      /// Retornar la configuración almacenada
      ///
      return settings ? JSON.parse(settings) : this.defaultSettings;
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error(`Error getting settings for ${this.key}:`, error);
      ///
      /// Retornar los valores por defecto
      ///
      return this.defaultSettings;
    }
  }

  ///
  /// Actualizar la configuración
  ///
  async updateSettings(newSettings: Partial<T>): Promise<void> {
    try {
      ///
      /// Obtener la configuración actual
      ///
      const currentSettings = await this.getSettings();
      ///
      /// Obtener la nueva configuración
      ///
      const updatedSettings = {
        ...currentSettings,
        ...newSettings,
      };
      ///
      /// Guardar la nueva configuración
      ///
      await AsyncStorage.setItem(this.key, JSON.stringify(updatedSettings));
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error(`Error updating settings for ${this.key}:`, error);
      ///
      /// Lanzar el error
      ///
      throw error;
    }
  }

  ///
  /// Resetear la configuración a los valores por defecto
  ///
  async resetSettings(): Promise<void> {
    try {
      ///
      /// Guardar la configuración por defecto
      ///
      await AsyncStorage.setItem(
        this.key,
        JSON.stringify(this.defaultSettings)
      );
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error(`Error resetting settings for ${this.key}:`, error);
      ///
      /// Lanzar el error
      ///
      throw error;
    }
  }
}
