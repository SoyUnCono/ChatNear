import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";
import { SUPABASE_URL } from "@env";

////
/// Storage
////
export const storage = {
  /**
   * Sube una imagen al storage
   */
  uploadImage: async (uri: string, path: string): Promise<string | null> => {
    try {
      ////
      /// Subir la imagen al storage
      ////
      const response = await fetch(uri);

      ////
      /// Obtener el blob de la imagen
      ////
      const blob = await response.blob();

      ////
      /// Obtener el base64 de la imagen
      const base64 = await new Promise((resolve) => {
        ////
        /// Crear un lector de archivos
        ////
        const reader = new FileReader();

        ////
        /// Leer la imagen
        ////
        reader.onload = () => {
          ////
          /// Si el resultado es una cadena, obtener el base64
          ////
          if (typeof reader.result === "string")
            resolve(reader.result.split(",")[1]);
        };

        ////
        /// Leer la imagen
        ////
        reader.readAsDataURL(blob);
      });

      ////
      /// Subir la imagen al storage
      ////
      const { data, error } = await supabase.storage
        ////
        /// Obtener el bucket de avatares
        ////
        .from("avatars")
        ////
        /// Subir la imagen al storage
        ////
        .upload(path, decode(base64 as string), {
          contentType: "image/png",
          upsert: true,
        });

      ////
      /// Si hay un error, lanzar un error
      ////
      if (error) throw error;

      ////
      /// Construir la URL pública directamente
      ////
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;

      ////
      /// Retornar la URL pública
      ////
      return publicUrl;
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error uploading image:", error);

      ////
      /// Retornar null
      ////
      return null;
    }
  },

  /**
   * Actualiza el avatar del usuario
   */
  updateUserAvatar: async (
    userId: string,
    avatarUrl: string
  ): Promise<void> => {
    try {
      ////
      /// Actualizar el avatar del usuario
      ////
      const { error } = await supabase
        ////
        /// Obtener la tabla de usuarios
        ////
        .from("profiles")
        ////
        /// Actualizar el avatar del usuario
        ////
        .update({ avatar_url: avatarUrl })
        ////
        /// Equivalente a WHERE id = userId
        .eq("id", userId);

      ////
      /// Si hay un error, lanzar un error
      ////
      if (error) throw error;
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error updating avatar URL:", error);

      ////
      /// Lanzar el error
      ////
      throw error;
    }
  },

  /**
   * Elimina una imagen del storage
   */
  deleteImage: async (path: string): Promise<void> => {
    try {
      ////
      /// Eliminar la imagen del storage
      ////
      const { error } = await supabase.storage.from("avatars").remove([path]);

      ////
      /// Si hay un error, lanzar un error
      ////
      if (error) throw error;
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error deleting image:", error);
    }
  },
};
