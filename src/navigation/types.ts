////
/// Tipos de la pila de navegación de autenticación
////
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

////
/// Tipos de la pila de navegación principal
////
export type MainStackParamList = {
  TabNavigator: undefined;
  Chat: { chatId: string };
  Profile: { userId: string };
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  SecuritySettings: undefined;
  AboutSettings: undefined;
  HelpSettings: undefined;
  LanguageSettings: undefined;
  RegionSettings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  TwoFactorAuth: undefined;
};

////
/// Tipos de la navegación inferior
////
export type BottomTabParamList = {
  Home: undefined;
  DMs: undefined;
  Favorites: undefined;
  Settings: undefined;
};

////
/// Tipos de la pila de navegación de la aplicación
////
export type RootStackParamList = MainStackParamList & BottomTabParamList;
