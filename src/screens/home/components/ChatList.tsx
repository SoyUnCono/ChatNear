import React from "react";
import { FlatList, StyleSheet, Platform } from "react-native";
import { Chat } from "../../../types";
import { ChatListItem } from "../../../components/ChatListItem";
import { EmptyState } from "./EmptyState";

interface ChatListProps {
  chats: Chat[];
  loading: boolean;
  onRefresh: () => void;
  locationError?: string | null;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  loading,
  onRefresh,
  locationError,
}) => {
  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatListItem chat={item} />}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Platform.OS === "ios" ? 100 : 80 },
      ]}
      refreshing={loading}
      onRefresh={onRefresh}
      ListEmptyComponent={() =>
        !loading ? <EmptyState locationError={locationError} /> : null
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
