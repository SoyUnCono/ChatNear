import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomAlert } from "../../../components/CustomAlert";

interface ChatInputProps {
  onSend: (message: string, imageUri?: string) => void;
  disabled?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  onTyping,
}) => {
  const [message, setMessage] = useState("");
  const { theme } = useTheme();

  const handleSend = async () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleImagePick = async () => {
    try {
      // Solicitar permisos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        CustomAlert.error(
          "Permiso denegado",
          "Necesitamos acceso a tu galería para enviar imágenes."
        );
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        console.log("Selected image:", {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
        });

        // Enviar imagen
        onSend("", asset.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      CustomAlert.error(
        "Error",
        "No se pudo seleccionar la imagen. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <TouchableOpacity
        onPress={handleImagePick}
        style={styles.button}
        disabled={disabled}
      >
        <Ionicons
          name="image"
          size={24}
          color={disabled ? theme.text.secondary : theme.action.primary}
        />
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.background.secondary,
            color: theme.text.primary,
          },
        ]}
        placeholder="Escribe un mensaje..."
        placeholderTextColor={theme.text.secondary}
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={1000}
        editable={!disabled}
        onFocus={() => onTyping?.(true)}
        onBlur={() => onTyping?.(false)}
      />

      <TouchableOpacity
        onPress={handleSend}
        style={[
          styles.button,
          {
            backgroundColor:
              message.trim() && !disabled
                ? theme.action.primary
                : theme.action.disabled,
          },
        ]}
        disabled={!message.trim() || disabled}
      >
        <Ionicons
          name="send"
          size={20}
          color={
            message.trim() && !disabled
              ? theme.text.inverse
              : theme.text.secondary
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
