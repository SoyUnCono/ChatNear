////
/// Formatear la fecha relativa
////
export const formatRelativeTime = (
  timestamp?: string | number | Date
): string => {
  ///
  /// Verificar si el timestamp es null, undefined o vacío
  ///
  if (timestamp === null || timestamp === undefined || timestamp === "") {
    ///
    /// Retornar cadena vacía si no hay timestamp válido
    ///
    return "";
  }

  ///
  /// Convertir el timestamp a un objeto Date si es necesario
  ///
  const date =
    typeof timestamp === "number" || typeof timestamp === "string"
      ? new Date(timestamp)
      : timestamp;

  ///
  /// Obtener la fecha actual
  ///
  const now = new Date();

  ///
  /// Calcular la diferencia en segundos
  ///
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  ///
  /// Retornar la fecha relativa usando un switch con rangos
  ///
  switch (true) {
    case diffInSeconds < 60:
      return "ahora";
    case diffInSeconds < 3600: {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes}m`;
    }
    case diffInSeconds < 86400: {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours}h`;
    }
    case diffInSeconds < 604800: {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days}d`;
    }
    default:
      return date.toLocaleDateString();
  }
};
