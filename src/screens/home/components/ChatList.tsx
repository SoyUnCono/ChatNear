import React from "react";
import { FlatList, StyleSheet, Platform } from "react-native";
import { Chat } from "../../../types";
import { ChatListItem } from "../../../components/chat-list/ChatListItem";
import { EmptyState } from "./EmptyState";

///
/// Props
///
interface ChatListProps {
  ///
  /// Chats
  ///
  chats: Chat[];

  ///
  /// Cargando
  ///
  loading: boolean;

  ///
  /// Refrescar
  ///
  onRefresh: () => void;

  ///
  /// Error de  permiso de ubicación
  ///
  locationError?: string | null;
}

///
/// ChatList
///
export const ChatList: React.FC<ChatListProps> = ({
  ///
  /// Chats
  ///
  chats,

  ///
  /// Cargando
  ///
  loading,

  ///
  /// Refrescar
  ///
  onRefresh,

  ///
  /// Error de  permiso de ubicación
  ///
  locationError,
}) => {
  ///
  /// Renderizado
  ///
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
