import { useTheme } from "../../contexts/ThemeContext";
import { NavigationMenuItem } from "./types";

///
/// Items del menú
///
export const MENU_ITEMS: NavigationMenuItem[] = [
  ///
  /// Inicio
  ///
  { name: "Home", label: "Inicio", icon: "home-outline" },

  ///
  /// Mensajes
  ///
  { name: "DMs", label: "Mensajes", icon: "chatbubbles-outline" },

  ///
  /// Favoritos
  ///
  { name: "Favorites", label: "Favoritos", icon: "heart-outline" },

  ///
  /// Ajustes
  ///
  { name: "Settings", label: "Ajustes", icon: "settings-outline" },
];

///
/// Descripciones de los items
///
export const getMenuItemDescription = (
  ///
  /// Nombre del item
  ///
  name: NavigationMenuItem["name"]
): string => {
  ///
  /// Switch
  ///
  switch (name) {
    case "DMs":
      return "Mensajes directos y conversaciones";
    case "Favorites":
      return "Tus chats y contactos favoritos";
    case "Settings":
      return "Configuración y preferencias";
    default:
      return "";
  }
};
