import { supabase } from "./supabase";
import { User } from "../types";
import { storage } from "./storage";

////
/// Tipos
////
export type AuthError = {
  message: string;
};

////
/// Tipos
////
export type AuthResponse = {
  user: User | null;
  error: AuthError | null;
};

////
/// Tipos
////
export type SignUpData = {
  email: string;
  password: string;
  username: string;
  avatarUri?: string;
};

////
/// Servicio de autenticación
////
export const auth = {
  /**
   * Obtiene el usuario actual
   */
  getCurrentUser: async (): Promise<User | null> => {
    ////
    /// Obtener el usuario actual
    ////
    const {
      data: { user },
    } = await supabase.auth.getUser();
    ///
    /// Si no hay un usuario, retornar null
    ///
    if (!user) return null;

    ////
    /// Obtener el perfil del usuario
    ////
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    ////
    /// Retornar el perfil del usuario
    ////
    return profile;
  },

  /**
   * Registra un nuevo usuario
   */
  signUp: async ({
    email,
    password,
    username,
    avatarUri,
  }: SignUpData): Promise<AuthResponse> => {
    try {
      // Primero registramos al usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError)
        return { user: null, error: { message: authError.message } };
      if (!authData.user)
        return {
          user: null,
          error: { message: "No se pudo crear el usuario" },
        };

      // Esperamos un momento para asegurarnos de que el perfil se haya creado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Si hay un avatar, lo subimos
      let avatarUrl = null;
      if (avatarUri) {
        avatarUrl = await storage.uploadImage(
          avatarUri,
          `${authData.user.id}/avatar.png`
        );
      }

      // Si se subió el avatar, actualizamos el perfil
      if (avatarUrl) {
        await supabase
          .from("profiles")
          .update({ avatar_url: avatarUrl })
          .eq("id", authData.user.id);
      }

      // Obtenemos el perfil actualizado
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      return { user: profile, error: null };
    } catch (error) {
      return {
        user: null,
        error: {
          message:
            error instanceof Error ? error.message : "Error al registrarse",
        },
      };
    }
  },

  /**
   * Inicia sesión con email y contraseña
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    ////
    /// Iniciar sesión con email y contraseña
    ////
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    ////
    /// Si hay un error, retornar el error
    ////
    if (error) return { user: null, error: { message: error.message } };

    ////
    /// Obtener el perfil del usuario
    ////
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    ////
    /// Retornar el perfil del usuario
    ////
    return { user: profile, error: null };
  },

  /**
   * Cierra la sesión actual
   */
  signOut: async (): Promise<{ error: AuthError | null }> => {
    ////
    /// Cerrar la sesión actual
    ////
    const { error } = await supabase.auth.signOut();

    ////
    /// Si hay un error, retornar el error
    ////
    if (error) return { error: { message: error.message } };

    ////
    /// Retornar null
    ////
    return { error: null };
  },

  /**
   * Actualiza el perfil del usuario
   */
  updateProfile: async (profile: Partial<User>): Promise<AuthResponse> => {
    ////
    /// Obtener el usuario actual
    ////
    const { data: user, error } = await supabase.auth.getUser();

    ////
    /// Si hay un error, retornar el error
    ///
    if (error || !user.user)
      return { user: null, error: { message: "No se encontró el usuario" } };

    ////
    /// Actualizar el perfil del usuario
    ////
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.user.id)
      .select()
      .single();

    ////
    /// Si hay un error, retornar el error
    ////
    if (updateError)
      return { user: null, error: { message: updateError.message } };

    ////
    /// Retornar el usuario actualizado
    ////
    return { user: data, error: null };
  },
};
