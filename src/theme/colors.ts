// Colores base
const palette = {
  // Azules
  blue: {
    50: "#E3F2FD",
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2196F3", // Principal
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1",
  },
  // Grises
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  // Estado
  status: {
    online: "#4CAF50",
    offline: "#9E9E9E",
    error: "#F44336",
    warning: "#FFC107",
    success: "#4CAF50",
  },
  // Otros
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

// Tema claro
export const lightTheme = {
  // Colores de fondo
  background: {
    primary: palette.white,
    secondary: palette.gray[50],
    tertiary: palette.gray[100],
  },
  // Colores de texto
  text: {
    primary: palette.gray[900],
    secondary: palette.gray[700],
    tertiary: palette.gray[500],
    inverse: palette.white,
  },
  // Colores de borde
  border: {
    primary: palette.gray[200],
    secondary: palette.gray[300],
  },
  // Colores de acción
  action: {
    primary: palette.blue[500],
    secondary: palette.blue[700],
    disabled: palette.gray[300],
  },
  // Colores de estado
  status: {
    online: palette.status.online,
    offline: palette.status.offline,
    error: palette.status.error,
    warning: palette.status.warning,
    success: palette.status.success,
  },
  // Colores de iconos
  icon: {
    primary: palette.gray[800],
    secondary: palette.gray[600],
    inverse: palette.white,
  },
  // Colores de notificación
  notification: {
    badge: palette.status.error,
    background: palette.white,
  },
};

// Tema oscuro
export const darkTheme = {
  // Colores de fondo
  background: {
    primary: palette.gray[900],
    secondary: palette.gray[800],
    tertiary: palette.gray[700],
  },
  // Colores de texto
  text: {
    primary: palette.white,
    secondary: palette.gray[300],
    tertiary: palette.gray[500],
    inverse: palette.gray[900],
  },
  // Colores de borde
  border: {
    primary: palette.gray[700],
    secondary: palette.gray[600],
  },
  // Colores de acción
  action: {
    primary: palette.blue[400],
    secondary: palette.blue[300],
    disabled: palette.gray[700],
  },
  // Colores de estado
  status: {
    online: palette.status.online,
    offline: palette.status.offline,
    error: palette.status.error,
    warning: palette.status.warning,
    success: palette.status.success,
  },
  // Colores de iconos
  icon: {
    primary: palette.gray[200],
    secondary: palette.gray[400],
    inverse: palette.gray[900],
  },
  // Colores de notificación
  notification: {
    badge: palette.status.error,
    background: palette.gray[800],
  },
};

// Tipo para el tema
export type Theme = typeof lightTheme;
