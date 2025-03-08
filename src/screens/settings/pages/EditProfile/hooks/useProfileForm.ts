import { useState } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { storage } from "../../../../../services/storage";
import { ProfileFormData } from "../types";
import { CustomAlert } from "../../../../../components/CustomAlert";

////
/// Hook
///
export const useProfileForm = () => {
  ///
  /// Usuario
  ///
  const { user, updateProfile } = useAuth();

  ///
  /// Estado
  ///
  const [loading, setLoading] = useState(false);

  ///
  /// Avatar URI
  ///
  const [avatarUri, setAvatarUri] = useState<string | null>(
    ///
    /// Si hay usuario, establecer el avatar URI
    ///
    user?.avatar_url || null
  );

  ///
  /// Formulario
  ///
  const [formData, setFormData] = useState<ProfileFormData>({
    ///
    /// Nombre
    ///
    name: user?.name || "",

    ///
    /// Usuario
    ///
    username: user?.username || "",

    ///
    /// Biografía
    ///
    bio: user?.bio || "",
  });

  ///
  /// Seleccionar imagen
  ///
  const handleImageSelected = async (uri: string) => {
    if (!user) return;

    setLoading(true);

    try {
      // Subir imagen y obtener URL
      const avatarUrl = await storage.uploadImage(uri, `${user.id}/avatar.png`);

      // Verificar si se obtuvo una URL válida
      if (!avatarUrl) {
        throw new Error("No se pudo obtener la URL de la imagen");
      }

      // Actualizar perfil con la nueva URL
      await updateProfile({ avatar_url: avatarUrl });

      // Actualizar estado local con timestamp para evitar cache
      setAvatarUri(`${avatarUrl}?t=${Date.now()}`);

      CustomAlert.success("Éxito", "Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error actualizando foto de perfil:", error);
      CustomAlert.error(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la foto de perfil. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  ///
  /// Guardar perfil
  ///
  const handleSaveProfile = async () => {
    ///
    /// Si no hay usuario, retornar
    ///
    if (!user) return;

    ///
    /// Cargando
    ///
    setLoading(true);

    try {
      ///
      /// Si no se pudo actualizar el perfil, mostrar un mensaje de error
      ///
      if (!formData.username.trim()) {
        CustomAlert.error("Error", "El nombre de usuario es requerido");
        return;
      }

      ///
      /// Actualizar perfil
      ///
      await updateProfile({
        ///
        /// Nombre
        ///
        name: formData.name.trim(),

        ///
        /// Usuario
        ///
        username: formData.username.trim(),

        ///
        /// Biografía
        ///
        bio: formData.bio.trim(),
      });

      ///
      /// Mostrar mensaje de éxito
      ///
      CustomAlert.success("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      ///
      /// Mostrar mensaje de error
      ///
      CustomAlert.error(
        "Error",
        "No se pudo actualizar el perfil. Por favor intenta nuevamente."
      );
    } finally {
      ///
      /// Finalizar carga
      ///
      setLoading(false);
    }
  };

  ///
  /// Retornar
  ///
  return {
    ///
    /// Cargando
    ///
    loading,

    ///
    /// Avatar URI
    ///
    avatarUri,

    ///
    /// Formulario
    ///
    formData,

    ///
    /// Establecer formulario
    ///
    setFormData,

    ///
    /// Seleccionar imagen
    ///
    handleImageSelected,

    ///
    /// Guardar perfil
    ///
    handleSaveProfile,
  };
};
