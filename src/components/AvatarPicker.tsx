import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

////
/// Tipos
////
type Props = {
  ///
  /// URI de la imagen
  ///
  imageUri: string | null;

  ///
  /// Seleccionar imagen
  ///
  onImageSelected: (uri: string) => void;
};

////
/// Componente de selección de avatar
////
export const AvatarPicker: React.FC<Props> = ({
  ///
  /// URI de la imagen
  ///
  imageUri,

  ///
  /// Seleccionar imagen
  ///
  onImageSelected,
}) => {
  ////
  /// Tema
  ///
  const { theme } = useTheme();

  ////
  /// Seleccionar imagen
  ///
  const pickImage = async () => {
    try {
      ////
      /// Solicitar permisos
      ///
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      ////
      /// Si no se han concedido permisos, mostrar un mensaje de error
      ///
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos acceso a tu galería para seleccionar una foto de perfil"
        );
        return;
      }

      ////
      /// Mostrar instrucciones antes de abrir el selector
      ///
      Alert.alert(
        "Seleccionar foto de perfil",
        "Selecciona una foto de tu galería y ajústala para usarla como foto de perfil.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Elegir foto",
            style: "default",
            onPress: async () => {
              try {
                ////
                /// Elegir foto
                ///
                const result = await ImagePicker.launchImageLibraryAsync({
                  ///
                  /// Tipos de medios
                  ///
                  mediaTypes: "images" as ImagePicker.MediaTypeOptions,

                  ///
                  /// Permitir edición
                  ///
                  allowsEditing: true,

                  ///
                  /// Aspecto
                  ///
                  aspect: [1, 1],

                  ///
                  /// Calidad
                  ///
                  quality: 0.8,

                  ///
                  /// Asegurar que la imagen no sea demasiado grande
                  ///
                  exif: false,
                });

                ////
                /// Si no se ha cancelado y hay una imagen
                ///
                if (!result.canceled && result.assets[0]) {
                  const imageUri = result.assets[0].uri;

                  // Verificar el tamaño del archivo
                  const response = await fetch(imageUri);
                  const blob = await response.blob();
                  const fileSize = blob.size;
                  const maxSize = 5 * 1024 * 1024; // 5MB

                  if (fileSize > maxSize) {
                    Alert.alert(
                      "Error",
                      "La imagen es demasiado grande. Por favor selecciona una imagen más pequeña (máximo 5MB)."
                    );
                    return;
                  }

                  ////
                  /// Seleccionar la imagen
                  ///
                  onImageSelected(imageUri);
                }
              } catch (error) {
                console.error("Error al seleccionar imagen:", error);
                Alert.alert(
                  "Error",
                  "No se pudo seleccionar la imagen. Por favor, intenta de nuevo."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al acceder a la galería:", error);
      Alert.alert(
        "Error",
        "No se pudo acceder a la galería. Por favor, intenta de nuevo."
      );
    }
  };

  ////
  /// Renderizado
  ///
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: theme.border.primary }]}
      onPress={pickImage}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      ) : (
        <View
          style={[
            styles.placeholder,
            { backgroundColor: theme.background.secondary },
          ]}
        >
          <Ionicons name="camera" size={32} color={theme.icon.primary} />
        </View>
      )}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: theme.action.primary,
            borderColor: theme.background.primary,
          },
        ]}
      >
        <Ionicons name="add" size={20} color={theme.background.primary} />
      </View>
    </TouchableOpacity>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 60,
    borderWidth: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 58,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 58,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
});
