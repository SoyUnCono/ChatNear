import AsyncStorage from "@react-native-async-storage/async-storage";

///
/// Servicio de almacenamiento de configuración
///
export class SettingsStorage<T extends Record<string, any>> {
  ///
  /// Clave del almacenamiento
  ///
  private key: string;
  ///
  /// Valores por defecto
  ///
  private defaultValues: T;

  ///
  /// Constructor
  ///
  constructor(key: string, defaultValues: T) {
    ///
    /// Asignar la clave del almacenamiento
    ///
    this.key = key;
    ///
    /// Asignar los valores por defecto
    ///
    this.defaultValues = defaultValues;
  }

  ///
  /// Cargar los valores de la configuración
  ///
  async load(): Promise<T> {
    try {
      ///
      /// Obtener los valores de la configuración
      ///
      const savedSettings = await AsyncStorage.getItem(this.key);
      ///
      /// Retornar los valores de la configuración
      ///
      return savedSettings
        ? { ...this.defaultValues, ...JSON.parse(savedSettings) }
        : this.defaultValues;
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error(`Error loading settings for ${this.key}:`, error);
      ///
      /// Retornar los valores por defecto
      ///
      return this.defaultValues;
    }
  }

  ///
  /// Guardar los valores de la configuración
  ///
  async save(settings: Partial<T>): Promise<void> {
    try {
      ///
      /// Obtener los valores de la configuración
      ///
      const currentSettings = await this.load();
      ///
      /// Obtener los nuevos valores de la configuración
      ///
      const newSettings = { ...currentSettings, ...settings };
      ///
      /// Guardar los nuevos valores de la configuración
      ///
      await AsyncStorage.setItem(this.key, JSON.stringify(newSettings));
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error(`Error saving settings for ${this.key}:`, error);
      ///
      /// Lanzar el error
      ///
      throw error;
    }
  }

  ///
  /// Limpiar los valores de la configuración
  ///
  async clear(): Promise<void> {
    ///
    /// Intentar limpiar los valores de la configuración
    ///
    try {
      ///
      /// Limpiar los valores de la configuración
      ///
      await AsyncStorage.removeItem(this.key);
    } catch (error) {
      ///
      /// Mostrar un mensaje de advertencia
      ///
      console.error(`Error clearing settings for ${this.key}:`, error);
      ///
      /// Lanzar el error
      ///
      throw error;
    }
  }
}
