import React from "react";
import { View, Text } from "react-native";
import { MessageItemProps } from "../types";
import { styles } from "../styles";
import { formatRelativeTime } from "../../../utils/date";

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwnMessage,
  theme,
}) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <Text style={[styles.messageText, { color: theme.text.primary }]}>
        {message.content}
      </Text>
      <Text style={[styles.messageTime, { color: theme.text.secondary }]}>
        {formatRelativeTime(message.created_at)}
      </Text>
    </View>
  );
};
