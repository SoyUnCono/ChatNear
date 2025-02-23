import { Platform, StatusBar } from "react-native";
import { Theme } from "../../theme/colors";

////
/// Altura del Header incluyendo StatusBar y padding
////
export const HeaderHeight =
  ///
  /// Si es iOS
  ///
  Platform.OS === "ios" ? 88 : 64 + (StatusBar.currentHeight || 24);

////
/// Obtener los colores del Header basados en el tema
////
export const getHeaderColors = (theme: Theme) => ({
  ///
  /// Icono
  ///
  icon: theme.icon.primary,

  ///
  /// Icono activo
  ///
  iconActive: theme.icon.secondary,

  ///
  /// Fondo
  ///
  background: theme.background.primary,

  ///
  /// Borde
  ///
  border: theme.border.primary,

  ///
  /// Badge
  ///
  badge: theme.notification.badge,

  ///
  /// Estado online
  ///
  online: theme.status.online,
});
