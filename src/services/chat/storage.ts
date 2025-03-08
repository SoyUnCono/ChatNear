import { Platform } from "react-native";
import { supabase } from "../supabase";

export const storage = {
  /**
   * Subir una imagen al storage
   */
  uploadImage: async (
    chatId: string,
    imageUri: string
  ): Promise<{ url: string | null; error: Error | null }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // Limpiar la URI si es necesario
      const cleanUri = imageUri.replace("file://", "");

      // Obtener la extensión del archivo
      const fileExt = cleanUri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Crear FormData para la subida
      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? cleanUri.replace("file://", "") : cleanUri,
        type: `image/${fileExt}`,
        name: fileName,
      } as any);

      // Subir usando FormData
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, formData, {
          contentType: `image/${fileExt}`,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obtener la URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-images").getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading image:", error);
      return {
        url: null,
        error: error instanceof Error ? error : new Error("Error desconocido"),
      };
    }
  },
};
