import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, Theme } from "../theme/colors";

////
/// Tipos
////
type ThemeMode = "light" | "dark" | "system";

////
/// Contexto de tema
////
interface ThemeContextType {
  ///
  /// Tema
  ///
  theme: Theme;

  ///
  /// Modo de tema
  ///
  themeMode: ThemeMode;

  ///
  /// Establecer el modo de tema
  ///
  setThemeMode: (mode: ThemeMode) => Promise<void>;

  ///
  /// Si tenemos el modo oscuro activo --> usaremos esto para determinar el tema
  /// el tema que tenemos activo, de esta manera podemos cambiar el color del dispositivo
  /// de acuerdo a lo que el usuario tenga configurado en su dispositivo
  ///
  isDarkMode: boolean;
}

////
/// Contexto de tema
////
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

////
/// Clave del tema
////
const THEME_MODE_KEY = "@theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  ////
  /// Sistema de color
  ////
  const systemColorScheme = useColorScheme();

  ////
  /// Estado del modo de tema
  ////
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  ////
  /// Estado de carga
  ////
  const [isLoading, setIsLoading] = useState(true);

  ////
  /// Cargar el modo del tema guardado
  ////
  useEffect(() => {
    ////
    /// Cargar el modo del tema guardado
    ////
    loadThemeMode();
  }, []);

  ////
  /// Cargar el modo del tema guardado
  ////
  const loadThemeMode = async () => {
    try {
      ////
      /// Cargar el modo del tema guardado
      ////
      const savedThemeMode = await AsyncStorage.getItem(THEME_MODE_KEY);

      ////
      /// Si hay un modo de tema guardado, establecerlo
      ////
      if (savedThemeMode) {
        ////
        /// Establecer el modo del tema
        ////
        setThemeModeState(savedThemeMode as ThemeMode);
      }
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error loading theme mode:", error);
    } finally {
      ////
      /// Establecer el estado de carga
      ////
      setIsLoading(false);
    }
  };

  ////
  /// Establecer el modo del tema
  ////
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      ////
      /// Establecer el modo del tema
      ////
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
      ///
      /// Establecer el modo del tema
      ///
      setThemeModeState(mode);
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error saving theme mode:", error);
    }
  };

  ////
  /// Determinar si estamos en modo oscuro
  ////
  const isDarkMode =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  ////
  /// Seleccionar el tema basado en el modo
  ////
  const theme = isDarkMode ? darkTheme : lightTheme;

  ////
  /// No mostrar nada mientras cargamos el tema
  ////
  if (isLoading) {
    return null;
  }

  ////
  /// Proveedor de tema
  ////
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

////
/// Hook de tema
////
export const useTheme = () => {
  ////
  /// Obtener el contexto
  ////
  const context = useContext(ThemeContext);

  ////
  /// Si el contexto no está definido, lanzar un error
  ////
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  ////
  /// Retornar el contexto
  ////
  return context;
};
