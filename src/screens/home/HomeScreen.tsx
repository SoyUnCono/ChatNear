import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useRandomChat } from "../../contexts/RandomChatContext";
import { useChats } from "./hooks/useChats";
import { ChatList } from "./components/ChatList";
import { SearchingOverlay } from "./components/SearchingOverlay";
import { RandomChatButton } from "../../components/RandomChatButton";

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { chats, loading, refreshChats } = useChats();
  const { isSearching, locationError, startSearch, cancelSearch } =
    useRandomChat();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      edges={["bottom"]}
    >
      <View style={styles.content}>
        <ChatList
          chats={chats}
          loading={loading}
          onRefresh={refreshChats}
          locationError={locationError}
        />
        {isSearching ? (
          <SearchingOverlay onCancel={cancelSearch} />
        ) : (
          <RandomChatButton
            label="Nuevo Chat"
            onPress={startSearch}
            disabled={!!locationError}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
