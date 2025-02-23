import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { auth, SignUpData } from "../services/auth";
import { supabase } from "../services/supabase";

////
/// Tipos
////
type AuthContextType = {
  ///
  /// Usuario actual
  ///
  user: User | null;

  ///
  /// Estado de carga
  ///
  loading: boolean;

  ///
  /// Iniciar sesión
  ///
  signIn: (email: string, password: string) => Promise<void>;

  ///
  /// Registrar un nuevo usuario
  ///
  signUp: (data: SignUpData) => Promise<void>;

  ///
  /// Cerrar sesión
  ///
  signOut: () => Promise<void>;

  ///
  /// Actualizar el perfil del usuario
  ///
  updateProfile: (profile: Partial<User>) => Promise<void>;
};

////
/// Contexto de autenticación
////
const AuthContext = createContext<AuthContextType | undefined>(undefined);

////
/// Proveedor de autenticación
////
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  ///
  /// Estado del usuario
  ///
  const [user, setUser] = useState<User | null>(null);

  ///
  /// Estado de carga
  ///
  const [loading, setLoading] = useState(true);

  ///
  /// Efecto para verificar el usuario actual
  ///
  useEffect(() => {
    ////
    /// Verificar el usuario actual al montar el componente
    ////
    checkUser();

    ////
    /// Suscribirse a los cambios de autenticación
    ////
    const { data: authListener } = supabase.auth.onAuthStateChange(
      ////
      /// Evento de autenticación
      ////
      async (event, session) => {
        ////
        /// Si el usuario está autenticado
        ////
        if (event === "SIGNED_IN") {
          ////
          /// Obtener el usuario actual
          ////
          const user = await auth.getCurrentUser();

          ////
          /// Actualizar el usuario actual
          ////
          setUser(user);
        } else if (event === "SIGNED_OUT") {
          ////
          /// Actualizar el usuario actual
          ////
          setUser(null);
        }
      }
    );

    ////
    /// Limpiar la suscripción al evento de autenticación
    ////
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  ///
  /// Verificar el usuario actual
  ///
  const checkUser = async () => {
    try {
      ////
      /// Obtener el usuario actual
      ////
      const user = await auth.getCurrentUser();

      ////
      /// Actualizar el usuario actual
      ////
      setUser(user);
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error al verificar usuario:", error);
    } finally {
      ////
      /// Actualizar el estado de carga
      ////
      setLoading(false);
    }
  };

  ///
  /// Iniciar sesión
  ///
  const signIn = async (email: string, password: string) => {
    ////
    /// Iniciar sesión
    ////
    const { user, error } = await auth.signIn(email, password);

    ////
    /// Si hay un error, lanzar un error
    ////
    if (error) throw new Error(error.message);

    ////
    /// Actualizar el usuario actual
    ////
    setUser(user);
  };

  ///
  /// Registrar un nuevo usuario
  ///
  const signUp = async (data: SignUpData) => {
    ////
    /// Registrar un nuevo usuario
    ////
    const { user, error } = await auth.signUp(data);

    ////
    /// Si hay un error, lanzar un error
    ////
    if (error) throw new Error(error.message);

    ////
    /// Actualizar el usuario actual
    ////
    setUser(user);
  };

  ///
  /// Cerrar sesión
  ///
  const signOut = async () => {
    ////
    /// Cerrar sesión
    ////
    const { error } = await auth.signOut();

    ////
    /// Si hay un error, lanzar un error
    ////
    if (error) throw new Error(error.message);

    ////
    /// Actualizar el usuario actual
    setUser(null);
  };

  ///
  /// Actualizar el perfil del usuario
  ///
  const updateProfile = async (profile: Partial<User>) => {
    ////
    /// Actualizar el perfil del usuario
    ////
    const { user, error } = await auth.updateProfile(profile);

    ////
    /// Si hay un error, lanzar un error
    ////
    if (error) throw new Error(error.message);

    ////
    /// Actualizar el usuario actual
    setUser(user);
  };

  ///
  /// Valor del contexto
  ///
  const value = {
    ///
    /// Usuario actual
    ///
    user,

    ///
    /// Estado de carga
    ///
    loading,

    ///
    /// Iniciar sesión
    ///
    signIn,

    ///
    /// Registrar un nuevo usuario
    ///
    signUp,

    ///
    /// Cerrar sesión
    ///
    signOut,

    ///
    /// Actualizar el perfil del usuario
    ///
    updateProfile,
  };

  ////
  /// Retornar el contexto
  ////
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

////
/// Hook de autenticación
////
export const useAuth = () => {
  ////
  /// Obtener el contexto
  ////
  const context = useContext(AuthContext);

  ////
  /// Si el contexto no está definido, lanzar un error
  ////
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  ////
  /// Retornar el contexto
  ////
  return context;
};
