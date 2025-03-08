import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles";
import { Theme } from "../../../contexts/ThemeContext";

interface MessageInputProps {
  onSend: (message: string, imageUri?: string) => void;
  onTyping?: (isTyping: boolean) => void;
  theme: Theme;
  isSending?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  theme,
  isSending = false,
}) => {
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTyping = () => {
    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSend = () => {
    if ((message.trim() || selectedImage) && !isSending) {
      onSend(message, selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
      Keyboard.dismiss();
      if (onTyping) {
        onTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setShowAttachments(false);
    }
  };

  const handleCameraLaunch = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowAttachments(false);
      }
    }
  };

  return (
    <>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.background.secondary },
        ]}
      >
        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: theme.background.tertiary },
          ]}
        >
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => setShowAttachments(true)}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={theme.text.secondary}
            />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: theme.text.primary }]}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={theme.text.tertiary}
            value={message}
            onChangeText={(text) => {
              setMessage(text);
              handleTyping();
            }}
            multiline
            maxLength={500}
            editable={!isSending}
          />

          {selectedImage && (
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={theme.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: theme.action.primary,
              opacity:
                (!message.trim() && !selectedImage) || isSending ? 0.5 : 1,
            },
          ]}
          onPress={handleSend}
          disabled={(!message.trim() && !selectedImage) || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAttachments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachments(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowAttachments(false)}
        >
          <View
            style={[
              styles.attachmentOptions,
              { backgroundColor: theme.background.primary },
            ]}
          >
            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={handleImagePick}
            >
              <View
                style={[
                  styles.attachmentIcon,
                  { backgroundColor: theme.action.secondary },
                ]}
              >
                <Ionicons name="images" size={24} color={theme.text.contrast} />
              </View>
              <Text
                style={[styles.attachmentLabel, { color: theme.text.primary }]}
              >
                Galería
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={handleCameraLaunch}
            >
              <View
                style={[
                  styles.attachmentIcon,
                  { backgroundColor: theme.action.secondary },
                ]}
              >
                <Ionicons name="camera" size={24} color={theme.text.contrast} />
              </View>
              <Text
                style={[styles.attachmentLabel, { color: theme.text.primary }]}
              >
                Cámara
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
