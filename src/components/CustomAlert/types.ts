///
/// Botón
///
export interface AlertButton {
  ///
  /// Texto
  ///
  text: string;

  ///
  /// OnPress
  ///
  onPress?: () => void;

  ///
  /// Estilo
  ///
  style?: "default" | "cancel" | "destructive";

  ///
  /// Icono
  ///
  icon?: string;
}

///
/// Opciones
///
export interface AlertOptions {
  ///
  /// Título
  ///
  title: string;

  ///
  /// Mensaje
  ///
  message?: string;

  ///
  /// Botones
  ///
  buttons?: AlertButton[];

  ///
  /// Tipo
  ///
  type?: "success" | "warning" | "danger" | "info";

  ///
  /// Icono
  ///
  icon?: string;
}
