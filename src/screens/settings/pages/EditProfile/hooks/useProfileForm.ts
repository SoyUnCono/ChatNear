import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../../../../contexts/AuthContext";
import { storage } from "../../../../../services/storage";
import { ProfileFormData } from "../types";

export const useProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(
    user?.avatar_url || null
  );
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
  });

  const handleImageSelected = async (uri: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const avatarUrl = await storage.uploadImage(uri, `${user.id}/avatar.png`);

      if (!avatarUrl) {
        throw new Error("No se pudo subir la imagen");
      }

      await updateProfile({ avatar_url: avatarUrl });
      setAvatarUri(avatarUrl);
      Alert.alert("Éxito", "Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar avatar:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar la foto de perfil. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (!formData.username.trim()) {
        Alert.alert("Error", "El nombre de usuario es requerido");
        return;
      }

      await updateProfile({
        name: formData.name.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim(),
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert(
        "Error",
        "No se pudo actualizar el perfil. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    avatarUri,
    formData,
    setFormData,
    handleImageSelected,
    handleSaveProfile,
  };
};
