////
/// Tipos de la pila de navegación de autenticación
////
export type AuthStackParamList = {
  ///
  /// Inicio de sesión
  ///
  Login: undefined;

  ///
  /// Registro
  ///
  Register: undefined;
};

////
/// Tipos de la pila de navegación principal
////
export type MainStackParamList = {
  ///
  /// Navegación inferior
  ///
  TabNavigator: undefined;

  ///
  /// Chat
  ///
  Chat: { chatId: string };

  ///
  /// Perfil
  ///
  Profile: { userId: string };

  ///
  /// Ajustes de privacidad
  ///
  PrivacySettings: undefined;

  ///
  /// Ajustes de seguridad
  ///
  SecuritySettings: undefined;

  ///
  /// Ajustes de notificaciones
  ///
  NotificationSettings: undefined;

  ///
  /// Ajustes de idioma
  ///
  LanguageSettings: undefined;

  ///
  /// Ajustes de región
  ///
  RegionSettings: undefined;

  ///
  /// Editar perfil
  ///
  EditProfile: undefined;

  ///
  /// Cambiar contraseña
  ///
  ChangePassword: undefined;

  ///
  /// Inicio
  ///
  Home: undefined;

  ///
  /// Ajustes
  ///
  Settings: undefined;

  ///
  /// Notificaciones
  ///
  Notifications: undefined;
};

////
/// Tipos de la navegación inferior
////
export type BottomTabParamList = {
  ///
  /// Inicio
  ///
  Home: undefined;

  ///
  /// Mensajes
  ///
  DMs: undefined;

  ///
  /// Favoritos
  ///
  Favorites: undefined;

  ///
  /// Ajustes
  Settings: undefined;
};

////
/// Tipos de la pila de navegación de la aplicación
////
export type RootStackParamList = MainStackParamList & BottomTabParamList;
