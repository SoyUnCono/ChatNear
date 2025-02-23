import { supabase } from "./supabase";
import { User } from "../types";
import { storage } from "./storage";
import { SUPABASE_URL } from "@env";

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

    ////
    /// Si no hay un usuario, retornar null
    ////
    if (!user) return null;

    ////
    /// Obtener el perfil del usuario
    ////
    const { data: profile } = await supabase
      ////
      /// Obtener la tabla de usuarios
      ////
      .from("profiles")
      ////
      /// Seleccionar el usuario
      ////
      .select("*")
      ////
      /// Equivalente a WHERE id = userId
      ////
      .eq("id", user.id)
      ////
      /// Retornar el perfil del usuario
      ////
      .single();

    ////
    /// Retornar el perfil del usuario
    ////
    return profile;
  },

  /**
   * Actualiza manualmente el avatar del usuario
   */
  fixAvatar: async (userId: string): Promise<void> => {
    ////
    /// Obtener la URL del avatar
    ////
    const avatarUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${userId}/avatar.png`;

    ////
    /// Actualizar el avatar del usuario
    ////
    await storage.updateUserAvatar(userId, avatarUrl);
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
      ////
      /// Primero registramos al usuario
      ////
      const { data: authData, error: authError } = await supabase.auth.signUp({
        ///
        /// Email
        ///
        email,
        ///
        /// Contraseña
        ///
        password,
        ///
        /// Opciones
        ///
        options: {
          ///
          /// Datos
          ///
          data: {
            ///
            /// Nombre de usuario
            ///
            username,
          },
        },
      });

      ///
      /// Si hay un error, retornar un error
      ///
      if (authError)
        return { user: null, error: { message: authError.message } };

      ///
      /// Si no hay un usuario, retornar un error
      ///
      if (!authData.user)
        return {
          user: null,
          error: { message: "No se pudo crear el usuario" },
        };

      ////
      /// Esperamos un momento para asegurarnos de que el perfil se haya creado
      ////
      await new Promise((resolve) => setTimeout(resolve, 1000));

      ////
      /// Si hay un avatar, lo subimos
      ////
      let avatarUrl = null;

      ////
      /// Si hay un avatar, lo subimos
      ////
      if (avatarUri) {
        ////
        /// Subir el avatar
        ////
        avatarUrl = await storage.uploadImage(
          avatarUri,
          `${authData.user.id}/avatar.png`
        );

        ///
        /// Si se subió el avatar, actualizamos el perfil inmediatamente
        ///
        if (avatarUrl) {
          ////
          /// Actualizar el perfil del usuario
          ////
          const { error: updateError } = await supabase
            ////
            /// Obtener la tabla de usuarios
            ////
            .from("profiles")
            ////
            /// Actualizar el perfil del usuario
            ////
            .update({
              avatar_url: avatarUrl,
              status: "online",
            })
            ////
            /// Equivalente a WHERE id = userId
            ////
            .eq("id", authData.user.id);

          ////
          /// Si hay un error, imprimir el error
          ////
          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
        }
      }

      ////
      /// Obtener el perfil actualizado
      ////
      const { data: profile } = await supabase
        ////
        /// Obtener la tabla de usuarios
        ////
        .from("profiles")
        ////
        /// Seleccionar el usuario
        ////
        .select("*")
        ////
        /// Equivalente a WHERE id = userId
        ////
        .eq("id", authData.user.id)
        ////
        /// Retornar el perfil del usuario
        ////
        .single();

      ////
      /// Retornar el perfil del usuario
      ////
      return { user: profile, error: null };
    } catch (error) {
      ////
      /// Retornar el error
      ////
      return {
        ////
        /// Retornar el usuario
        ////
        user: null,
        ////
        /// Retornar el error
        ////
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
    try {
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

      // Actualizamos el estado a online
      await supabase
        .from("profiles")
        .update({ status: "online", last_seen: new Date().toISOString() })
        .eq("id", data.user.id);

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
    } catch (error) {
      return {
        user: null,
        error: {
          message:
            error instanceof Error ? error.message : "Error al iniciar sesión",
        },
      };
    }
  },

  /**
   * Cierra la sesión actual
   */
  signOut: async (): Promise<{ error: AuthError | null }> => {
    try {
      // Primero actualizamos el estado a offline
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            status: "offline",
            last_seen: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

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
    } catch (error) {
      return {
        error: {
          message:
            error instanceof Error ? error.message : "Error al cerrar sesión",
        },
      };
    }
  },

  /**
   * Actualiza el perfil del usuario
   */
  updateProfile: async (profile: Partial<User>): Promise<AuthResponse> => {
    try {
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
    } catch (error) {
      return {
        user: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Error al actualizar perfil",
        },
      };
    }
  },
};
