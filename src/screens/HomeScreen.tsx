import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Chat } from "../types";
import { ChatListItem } from "../components/ChatListItem";
import { RandomChatButton } from "../components/RandomChatButton";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

////
/// Pantalla principal : TODO: Implementar la lógica para obtener los chats del usuario
/// Ademas cambiar la UX de la pantalla principal a una que sea mas intuitiva y atractiva,
/// y con más contenido.
////
export const HomeScreen: React.FC = () => {
  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Chats : TODO: Implementar la lógica para obtener los chats del usuario
  ////
  const [chats, setChats] = React.useState<Chat[]>([]);

  ////
  /// Renderizado
  ////
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatListItem chat={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tienes chats activos.{"\n"}
                ¡Inicia un chat aleatorio para comenzar!
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
    backgroundColor: "#fff",
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
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});
