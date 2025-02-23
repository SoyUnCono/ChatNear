////
/// Tipos de la pila de navegación de autenticación
////
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

////
/// Tipos de la pila de navegación de la aplicación
////
export type RootStackParamList = {
  Home: undefined;
  Chat: { chatId: string };
  Profile: { userId: string };
  Favorites: undefined;
  Settings: undefined;
  RandomChat: undefined;
  Notifications: undefined;
  ChatList: undefined;
};
