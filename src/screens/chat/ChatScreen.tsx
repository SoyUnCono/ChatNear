import React, { useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ViewabilityConfig,
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
import { ChatInput } from "./components/ChatInput";

type ChatScreenRouteProp = RouteProp<MainStackParamList, "Chat">;

export const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const { chatId } = route.params;

  const {
    messages,
    currentUser,
    otherUser,
    isLoading,
    chat,
    handleSend,
    handleTyping,
    isSending,
    onViewableItemsChanged,
  } = useChatLogic(chatId);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <ChatHeader
          otherUser={otherUser}
          chat={chat}
          onEndChat={() => console.log("Finalizando chat")}
          theme={theme}
        />
      ),
      headerShown: true,
    });
  }, [navigation, otherUser, chat, theme]);

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isOwnMessage = message.sender_id === currentUser?.id;
    return (
      <MessageItem
        message={message}
        isOwnMessage={isOwnMessage}
        theme={theme}
        sender={isOwnMessage ? currentUser : otherUser}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: "transparent" }]}>
        <Text style={{ color: theme.text.primary }}>Cargando chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "transparent" }]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        style={[styles.content, { backgroundColor: "transparent" }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />

        <ChatInput
          onSend={handleSend}
          disabled={isSending || chat?.status !== "active"}
          onTyping={handleTyping}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
