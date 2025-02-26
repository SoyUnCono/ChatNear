import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface RandomChatContextType {
  ///
  /// Estado de búsqueda
  ///
  isSearching: boolean;

  ///
  /// Ubicación actual
  ///
  location: { lat: number; lng: number } | null;

  ///
  /// Error de ubicación
  ///
  locationError: string | null;

  ///
  /// Distancia máxima (en metros)
  ///
  maxDistance: number;

  ///
  /// Establecer distancia máxima
  ///
  setMaxDistance: (distance: number) => void;

  ///
  /// Iniciar búsqueda
  ///
  startSearch: () => Promise<void>;

  ///
  /// Cancelar búsqueda
  ///
  cancelSearch: () => Promise<void>;
}

export interface ChatParticipantPayload {
  chat_id: string;
  user_id: string;
}
