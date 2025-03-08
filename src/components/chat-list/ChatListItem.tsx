import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Chat } from "../../types";
import { useTheme } from "../../contexts/ThemeContext";
import { ChatOptionsModal } from "../chat-options/ChatOptionsModal";
import { ChatAvatar } from "./ChatAvatar";
import { ChatContent } from "./ChatContent";
import { useChatListItem } from "../../hooks/useChatListItem";

interface ChatListItemProps {
  chat: Chat;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  const [showOptions, setShowOptions] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { currentUserId, lastMessage, unreadCount, otherUser } =
    useChatListItem(chat);

  const handlePress = () => {
    navigation.navigate("Chat", { chatId: chat.id });
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: theme.background.primary,
            borderBottomColor: theme.border.primary,
          },
        ]}
        onPress={handlePress}
        onLongPress={() => setShowOptions(true)}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        <ChatAvatar user={otherUser} theme={theme} />
        <ChatContent
          otherUser={otherUser}
          lastMessage={lastMessage}
          unreadCount={unreadCount}
          isAnonymous={chat.is_anonymous}
          theme={theme}
        />
      </TouchableOpacity>

      <ChatOptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        chat={chat}
        otherUser={otherUser!}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
  },
});
