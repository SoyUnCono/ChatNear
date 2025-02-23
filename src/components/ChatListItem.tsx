import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Chat } from "../types";

////
/// Tipos
////
type Props = {
  chat: Chat;
};

////
/// Navegación
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

////
/// Componente
////
export const ChatListItem: React.FC<Props> = ({ chat }) => {
  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Evento : Navegar a la pantalla de chat
  ////
  const handlePress = () => {
    navigation.navigate("Chat", { chatId: chat.id });
  };

  ////
  /// Renderizado
  ////
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.avatarContainer}>
        {chat.is_anonymous ? (
          <View style={styles.anonymousAvatar}>
            <Text style={styles.anonymousText}>?</Text>
          </View>
        ) : (
          <Image
            source={{ uri: "https://via.placeholder.com/40" }} // TODO: Reemplazar con avatar real
            style={styles.avatar}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.username}>
            {chat.is_anonymous ? "Usuario Anónimo" : "Nombre de Usuario"}{" "}
            {/* TODO: Obtener nombre real */}
          </Text>
          <Text style={styles.time}>
            {new Date(
              chat.last_message_at || chat.created_at
            ).toLocaleTimeString()}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {chat.last_message || "No hay mensajes aún"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  anonymousAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
  },
  anonymousText: {
    fontSize: 20,
    color: "#666",
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
});
