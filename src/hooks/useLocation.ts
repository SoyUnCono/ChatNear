import { useState, useCallback } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

export const useLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError(
          "Necesitamos acceso a tu ubicación para encontrar personas cercanas"
        );
        return;
      }

      // En Android, verificar si la ubicación está activada
      if (Platform.OS === "android") {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          setLocationError(
            "Por favor activa la ubicación en tu dispositivo para continuar"
          );
          return;
        }
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setLocationError(null);
    } catch (error) {
      setLocationError(
        "No pudimos obtener tu ubicación. Por favor intenta de nuevo."
      );
    }
  }, []);

  return {
    location,
    locationError,
    requestLocationPermission,
  };
};
