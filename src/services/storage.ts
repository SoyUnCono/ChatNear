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

      ///
      /// Si no se pudo obtener la imagen, lanzar un error
      ///
      if (!response.ok) throw new Error("No se pudo obtener la imagen");

      ////
      /// Obtener el blob de la imagen
      ////
      const blob = await response.blob();

      ///
      /// Imprimir el tamaño de la imagen
      ///
      console.log("Tamaño de la imagen:", blob.size / 1024, "KB");

      ////
      /// Convertir a base64
      ///
      const base64 = await new Promise<string>((resolve, reject) => {
        ///
        /// Crear un reader
        ///
        const reader = new FileReader();

        ///
        /// Cuando se lea la imagen, convertirla a base64
        ///
        reader.onload = () => {
          ///
          /// Si el resultado es un string, convertirlo a base64
          ///
          if (typeof reader.result === "string") {
            ///
            /// Convertir el resultado a base64
            ///
            const base64Data = reader.result.split(",")[1];

            ///
            /// Resolver la promesa
            ///
            resolve(base64Data);
          } else {
            ///
            /// Rechazar la promesa
            ///
            reject(new Error("Error al leer la imagen"));
          }
        };

        ///
        /// Si hay un error, lanzar un error
        ///
        reader.onerror = () => reject(reader.error);

        ///
        /// Leer la imagen como dataURL
        ///
        reader.readAsDataURL(blob);
      });

      ////
      /// Subir la imagen al storage
      ////
      const { data, error } = await supabase.storage
        ///
        /// Usar el bucket de avatars
        ///
        .from("avatars")
        ///
        /// Subir la imagen
        ///
        .upload(path, decode(base64), {
          ///
          /// Tipo de contenido
          ///
          contentType: "image/png",
          ///
          /// Upsert
          ///
          upsert: true,
        });

      ////
      /// Si hay un error, lanzar un error
      ////
      if (error) {
        ///
        /// Imprimir el error
        ///
        console.error("Error al subir imagen:", error);

        ///
        /// Lanzar el error
        ///
        throw error;
      }

      ////
      /// Construir la URL pública
      ////
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;

      ///
      /// Imprimir la URL pública
      ///
      console.log("URL pública de la imagen:", publicUrl);

      ////
      /// Retornar la URL pública
      ////
      return publicUrl;
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error en uploadImage:", error);

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
    ///
    /// ID del usuario
    ///
    userId: string,
    ///
    /// URL del avatar
    ///
    avatarUrl: string
  ): Promise<void> => {
    try {
      ////
      /// Actualizar el avatar del usuario
      ////
      const { error } = await supabase
        ///
        /// Usar la tabla de usuarios
        ///
        .from("profiles")
        ///
        /// Actualizar el avatar
        ///
        .update({ avatar_url: avatarUrl })
        ///
        /// Equivalente a WHERE
        ///
        .eq("id", userId);

      ////
      /// Si hay un error, lanzar un error
      ////
      if (error) {
        ///
        /// Imprimir el error
        ///
        console.error("Error al actualizar avatar:", error);

        ///
        /// Lanzar el error
        ///
        throw error;
      }
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error en updateUserAvatar:", error);

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
      if (error) {
        ///
        /// Imprimir el error
        ///
        console.error("Error al eliminar imagen:", error);

        ///
        /// Lanzar el error
        ///
        throw error;
      }
    } catch (error) {
      ////
      /// Imprimir el error
      ////
      console.error("Error en deleteImage:", error);
    }
  },
};
