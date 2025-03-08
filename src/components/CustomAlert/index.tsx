import React from "react";
import { showMessage } from "react-native-flash-message";
import { Platform } from "react-native";
import { AlertModal } from "./components/AlertModal";
import { AlertButton, AlertOptions } from "./types";
import { styles } from "./styles";

///
/// Variable para controlar el estado del modal
///
let setModalVisible: (visible: boolean) => void = () => {};

///
/// Variable para controlar las opciones del modal
///
let setModalOptions: (options: AlertOptions) => void = () => {};

///
/// CustomAlert
///

export const CustomAlert = {
  ///
  /// Mostrar
  ///
  show: ({ title, message, type = "info", buttons, icon }: AlertOptions) => {
    ///
    /// Si hay botones, mostrar el modal
    ///
    if (buttons && buttons.length > 0) {
      ///
      /// Establecer las opciones del modal
      ///
      setModalOptions({ title, message, buttons, type, icon });

      ///
      /// Mostrar el modal
      ///
      setModalVisible(true);
    } else {
      ///
      /// Mostrar mensaje
      ///
      showMessage({
        ///
        /// Título
        ///
        message: title,

        ///
        /// Descripción
        ///
        description: message,

        ///
        /// Tipo
        ///
        type: type,

        ///
        /// Duración
        ///
        duration: 3000,

        ///
        /// Estilo
        ///
        style: styles.message,

        ///
        /// Estilo del texto
        ///
        titleStyle: {
          fontWeight: "600",
          fontFamily: Platform.OS === "ios" ? "System" : undefined,
        },

        ///
        /// Icono
        ///
        icon: type,

        ///
        /// Flotante
        ///
        floating: true,

        ///
        /// Ocultar la barra de estado
        ///
        hideStatusBar: false,
      });
    }
  },

  ///
  /// Success
  ///
  success: (title: string, message?: string, buttons?: AlertButton[]) => {
    ///
    /// Mostrar
    ///
    CustomAlert.show({
      title,
      message,
      type: "success",
      buttons,
    });
  },

  ///
  /// Error
  ///
  error: (title: string, message?: string, buttons?: AlertButton[]) => {
    ///
    /// Mostrar
    ///
    CustomAlert.show({
      title,
      message,
      type: "danger",
      buttons,
    });
  },
  ///
  /// Alerta
  ///
  warning: (title: string, message?: string, buttons?: AlertButton[]) => {
    CustomAlert.show({
      title,
      message,
      type: "warning",
      buttons,
    });
  },

  ///
  /// Info
  ///
  info: (title: string, message?: string, buttons?: AlertButton[]) => {
    CustomAlert.show({
      title,
      message,
      type: "info",
      buttons,
    });
  },

  ///
  /// Provider
  ///
  Provider: ({ children }: { children: React.ReactNode }) => {
    ///
    /// Estado
    ///
    const [isVisible, setIsVisible] = React.useState(false);

    ///
    /// Opciones
    ///
    const [options, setOptions] = React.useState<AlertOptions>({
      title: "",
      message: "",
      buttons: [],
    });

    ///
    /// Efecto
    ///
    React.useEffect(() => {
      ///
      /// Establecer las opciones del modal
      ///
      setModalVisible = setIsVisible;

      ///
      /// Establecer las opciones del modal
      ///
      setModalOptions = setOptions;
    }, []);

    ///
    /// Renderizado
    ///
    return (
      <>
        {children}
        <AlertModal
          visible={isVisible}
          options={options}
          onClose={() => setIsVisible(false)}
        />
      </>
    );
  },
};
