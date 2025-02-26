import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MessageInputProps } from "../types";
import { styles } from "../styles";

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  theme,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
  };

  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: theme.background.secondary },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text.primary,
            backgroundColor: theme.background.tertiary,
          },
        ]}
        placeholder="Escribe un mensaje..."
        placeholderTextColor={theme.text.tertiary}
        value={newMessage}
        onChangeText={setNewMessage}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: theme.action.primary }]}
        onPress={handleSend}
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
