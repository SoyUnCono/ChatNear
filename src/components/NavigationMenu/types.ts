import { RootStackParamList } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";

///
/// Props del NavigationMenu
///
export interface NavigationMenuProps {
  ///
  /// Estado: Visible
  ///
  visible: boolean;

  ///
  /// Evento: Cerrar
  ///
  onClose: () => void;
}

///
/// Item del menú
///
export interface NavigationMenuItem {
  ///
  /// Nombre
  ///
  name: keyof RootStackParamList;

  ///
  /// Etiqueta
  ///
  label: string;

  ///
  /// Icono
  ///
  icon: keyof typeof Ionicons.glyphMap;

  ///
  /// Parámetros
  ///
  params?: any;
}

///
/// Props del MenuItem
///
export interface MenuItemProps {
  ///
  /// Item
  ///
  item: NavigationMenuItem;

  ///
  /// Evento: Navegar
  ///
  onNavigate: (item: NavigationMenuItem) => void;

  ///
  /// Modo oscuro
  ///
  isDarkMode: boolean;
}
