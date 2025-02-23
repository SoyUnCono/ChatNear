import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Chat } from "../types";
import { ChatListItem } from "../components/ChatListItem";
import { RandomChatButton } from "../components/RandomChatButton";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

////
/// Pantalla principal
////
export const HomeScreen: React.FC = () => {
  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Theme
  ////
  const { theme } = useTheme();

  ////
  /// Chats : TODO: Implementar la lógica para obtener los chats del usuario
  ////
  const [chats, setChats] = React.useState<Chat[]>([]);

  ////
  /// Renderizado
  ////
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      edges={["bottom"]}
    >
      <View style={styles.content}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatListItem chat={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={64}
                color={theme.icon.secondary}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
                No hay chats activos
              </Text>
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                ¡Inicia un chat aleatorio para comenzar a conocer gente nueva!
              </Text>
            </View>
          )}
        />
        <RandomChatButton />
      </View>
    </SafeAreaView>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
