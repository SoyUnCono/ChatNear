import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useRandomChat } from "../../contexts/RandomChatContext";
import { useChats } from "./hooks/useChats";
import { ChatList } from "./components/ChatList";
import { SearchingOverlay } from "./components/SearchingOverlay";
import { RandomChatButton } from "../../components/RandomChatButton";
import { CustomAlert } from "../../components/CustomAlert";

///
/// HomeScreen
///
export const HomeScreen: React.FC = () => {
  ///
  /// Tema
  ///
  const { theme } = useTheme();

  ///
  /// Chats
  ///
  const { chats, loading, refreshChats } = useChats();

  ///
  /// Buscar chat
  ///
  const { isSearching, locationError, startSearch, cancelSearch } =
    useRandomChat();

  ///
  /// Renderizado
  ///
  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
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
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
  },
});
