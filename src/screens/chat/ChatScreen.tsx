import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "../../navigation/types";
import { Message } from "../../types";
import { styles } from "./styles";
import { useChatLogic } from "./hooks/useChatLogic";
import { ChatHeader } from "./components/ChatHeader";
import { MessageItem } from "./components/MessageItem";
import { MessageInput } from "./components/MessageInput";

type ChatScreenRouteProp = RouteProp<MainStackParamList, "Chat">;

export const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const { chatId } = route.params;

  const { messages, currentUser, otherUser, isLoading, chat, handleSend } =
    useChatLogic(chatId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <ChatHeader
          otherUser={otherUser}
          chat={chat}
          onEndChat={() => console.log("Finalizando chat")}
          theme={theme}
        />
      ),
      headerStyle: {
        backgroundColor: theme.background.secondary,
      },
      headerShadowVisible: false,
    });
  }, [otherUser, chat, theme, navigation]);

  const renderMessage = ({ item: message }: { item: Message }) => (
    <MessageItem
      message={message}
      isOwnMessage={message.sender_id === currentUser?.id}
      theme={theme}
    />
  );

  if (isLoading) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.background.primary }]}
      >
        <Text style={{ color: theme.text.primary }}>Cargando chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messagesList}
        />

        <MessageInput onSend={handleSend} theme={theme} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
