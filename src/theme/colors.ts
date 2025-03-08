// Colores base de iOS
const palette = {
  // Azules de iOS
  blue: {
    50: "#E3F2FD",
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#007AFF", // iOS Blue
    600: "#0062CC",
    700: "#004999",
    800: "#003166",
    900: "#001833",
  },
  // Grises de iOS
  gray: {
    50: "#F2F2F7", // iOS grouped background
    100: "#E5E5EA",
    200: "#D1D1D6",
    300: "#C7C7CC",
    400: "#AEAEB2",
    500: "#8E8E93",
    600: "#636366",
    700: "#48484A",
    800: "#3A3A3C",
    900: "#2C2C2E",
  },
  // Estado
  status: {
    online: "#34C759", // iOS Green
    offline: "#8E8E93", // iOS Gray
    error: "#FF3B30", // iOS Red
    warning: "#FF9500", // iOS Orange
    success: "#34C759", // iOS Green
  },
  // Otros
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

// Tema claro de iOS
export const lightTheme = {
  // Colores de fondo
  background: {
    primary: "#FFFFFF",
    secondary: "#F8F8FA", // Un blanco ligeramente más oscuro
    tertiary: "#FFFFFF",
  },
  // Colores de texto
  text: {
    primary: "#000000",
    secondary: "#1A1A1A",
    tertiary: "#4A4A4A",
    inverse: "#FFFFFF",
    contrast: "#FFFFFF",
  },
  // Colores de borde
  border: {
    primary: "#E5E5EA",
    secondary: "#F2F2F7",
  },
  // Colores de acción
  action: {
    primary: "#007AFF", // iOS Blue
    secondary: "#42A5F5", // iOS Blue más claro
    disabled: "#E3F2FD",
  },
  // Colores de estado
  status: {
    online: "#34C759",
    offline: "#8E8E93",
    error: "#FF3B30",
    warning: "#FF9500",
    success: "#34C759",
  },
  // Colores de iconos
  icon: {
    primary: "#3C3C43CC", // iOS icon primary (0.8 opacity)
    secondary: "#3C3C4399", // iOS icon secondary (0.6 opacity)
    inverse: "#FFFFFF",
  },
  // Colores de notificación
  notification: {
    badge: "#FF3B30", // iOS Red
    background: "#FFFFFF",
  },
  // Colores de chat
  chat: {
    ownMessage: palette.blue[500],
    otherMessage: palette.gray[100],
  },
};

// Tema oscuro de iOS
export const darkTheme = {
  // Colores de fondo
  background: {
    primary: "#1A1A1A", // Negro más suave
    secondary: "#242424", // Negro suave secundario
    tertiary: "#2A2A2A", // Negro suave terciario
  },
  // Colores de texto
  text: {
    primary: "#FFFFFF",
    secondary: "#F5F5F5",
    tertiary: "#E0E0E0",
    inverse: "#000000",
  },
  // Colores de borde
  border: {
    primary: "#2A2A2A",
    secondary: "#323232",
  },
  // Colores de acción
  action: {
    primary: "#007AFF", // iOS Blue
    secondary: "#42A5F5", // iOS Blue más claro
    disabled: "#3A3A3C",
  },
  // Colores de estado
  status: {
    online: "#30D158",
    offline: "#98989D",
    error: "#FF453A",
    warning: "#FF9F0A",
    success: "#30D158",
  },
  // Colores de iconos
  icon: {
    primary: "#FFFFFFCC", // iOS icon primary (0.8 opacity)
    secondary: "#FFFFFF99", // iOS icon secondary (0.6 opacity)
    inverse: "#000000",
  },
  // Colores de notificación
  notification: {
    badge: "#FF453A", // iOS Dark Mode Red
    background: "#1C1C1E",
  },
  // Colores de chat
  chat: {
    ownMessage: palette.blue[500],
    otherMessage: palette.gray[700],
  },
};

// Tipo para el tema
export type Theme = typeof lightTheme;
