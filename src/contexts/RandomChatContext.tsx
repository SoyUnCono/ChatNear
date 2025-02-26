import React, { createContext, useContext, useEffect } from "react";
import { useLocation } from "../hooks/useLocation";
import { useRandomChatSearch } from "../hooks/useRandomChatSearch";
import { RandomChatContextType } from "./types/RandomChatTypes";

///
/// Contexto
///
const RandomChatContext = createContext<RandomChatContextType | undefined>(
  undefined
);

///
/// Proveedor
///
export const RandomChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  ///
  /// Hooks
  ///
  const { location, locationError, requestLocationPermission } = useLocation();
  const {
    isSearching,
    maxDistance,
    setMaxDistance,
    startSearch,
    cancelSearch,
  } = useRandomChatSearch();

  ///
  /// Efecto: Solicitar permisos de ubicación al montar
  ///
  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  ///
  /// Valor del contexto
  ///
  const value: RandomChatContextType = {
    isSearching,
    location,
    locationError,
    maxDistance,
    setMaxDistance,
    startSearch: async () => {
      try {
        await startSearch(location);
      } catch (error) {
        console.error("Error in startSearch:", error);
      }
    },
    cancelSearch,
  };

  ///
  /// Renderizado
  ///
  return (
    <RandomChatContext.Provider value={value}>
      {children}
    </RandomChatContext.Provider>
  );
};

///
/// Hook
///
export const useRandomChat = () => {
  const context = useContext(RandomChatContext);
  if (context === undefined) {
    throw new Error(
      "useRandomChat debe ser usado dentro de RandomChatProvider"
    );
  }
  return context;
};
