import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
};

export const AvatarPicker: React.FC<Props> = ({
  imageUri,
  onImageSelected,
}) => {
  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos acceso a tu galería para seleccionar una foto de perfil"
        );
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera" size={32} color="#666" />
        </View>
      )}
      <View style={styles.badge}>
        <Ionicons name="add" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
});
