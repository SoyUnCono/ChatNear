import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { Chat, User } from "../../types";
import { CustomAlert } from "../CustomAlert";
import { chat as chatService } from "../../services/chat";
import { supabase } from "../../services/supabase";
import { UserInfo } from "./UserInfo";
import { OptionItem } from "./OptionItem";
import { MuteOptions } from "./MuteOptions";

interface ChatOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  chat: Chat;
  otherUser: User;
}

export const ChatOptionsModal: React.FC<ChatOptionsModalProps> = ({
  visible,
  onClose,
  chat,
  otherUser,
}) => {
  const { theme } = useTheme();
  const [showMuteOptions, setShowMuteOptions] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  useEffect(() => {
    checkBlockStatus();
  }, [visible, chat.id]);

  const checkBlockStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: participants } = await supabase
        .from("chat_participants")
        .select("user_id")
        .eq("chat_id", chat.id)
        .neq("user_id", user.id);

      const otherId = participants?.[0]?.user_id;
      setOtherUserId(otherId);

      if (otherId) {
        const { data: blockData } = await supabase
          .from("blocked_users")
          .select("*")
          .eq("user_id", user.id)
          .eq("blocked_user_id", otherId)
          .single();

        setIsBlocked(!!blockData);
      }
    } catch (error) {
      console.error("Error checking block status:", error);
    }
  };

  const handleAddFriend = async () => {
    try {
      const { error } = await chatService.sendFriendRequest(otherUser.id);
      if (error) throw error;
      CustomAlert.success(
        "Solicitud enviada",
        "Se ha enviado la solicitud de amistad"
      );
      onClose();
    } catch (error) {
      let errorMessage =
        "No se pudo enviar la solicitud. Por favor, intenta nuevamente.";
      if (
        error instanceof Error &&
        error.message === "Ya existe una solicitud de amistad pendiente"
      ) {
        errorMessage = error.message;
      }
      CustomAlert.error("Error", errorMessage);
    }
  };

  const handleMute = async (duration: number) => {
    try {
      const endTime = duration === -1 ? null : new Date(Date.now() + duration);
      const { error } = await chatService.muteChat(chat.id, endTime);
      if (error) throw error;
      CustomAlert.success(
        "Chat silenciado",
        `Las notificaciones han sido silenciadas ${
          duration === -1 ? "permanentemente" : "temporalmente"
        }`
      );
      setShowMuteOptions(false);
      onClose();
    } catch (error) {
      CustomAlert.error(
        "Error",
        "No se pudo silenciar el chat. Por favor, intenta nuevamente."
      );
    }
  };

  const handleBlock = () => {
    CustomAlert.show({
      title: "Bloquear usuario",
      message:
        "¿Estás seguro de que deseas bloquear a este usuario? No podrán volver a conectar en el futuro.",
      buttons: [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Bloquear",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await chatService.blockChat(chat.id);
              if (error) throw error;
              CustomAlert.success(
                "Usuario bloqueado",
                "El usuario ha sido bloqueado y el chat ha sido eliminado."
              );
              onClose();
            } catch (error) {
              CustomAlert.error(
                "Error",
                "No se pudo bloquear al usuario. Por favor, intenta nuevamente."
              );
            }
          },
        },
      ],
    });
  };

  const handleUnblock = () => {
    if (!otherUserId) return;

    CustomAlert.show({
      title: "Desbloquear usuario",
      message: "¿Estás seguro de que deseas desbloquear a este usuario?",
      buttons: [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desbloquear",
          onPress: async () => {
            try {
              const { error } = await chatService.unblockUser(otherUserId);
              if (error) throw error;
              setIsBlocked(false);
              CustomAlert.success(
                "Usuario desbloqueado",
                "El usuario ha sido desbloqueado exitosamente."
              );
            } catch (error) {
              CustomAlert.error(
                "Error",
                "No se pudo desbloquear al usuario. Por favor, intenta nuevamente."
              );
            }
          },
        },
      ],
    });
  };

  const handleDelete = () => {
    CustomAlert.show({
      title: "Eliminar chat",
      message:
        "¿Estás seguro de que deseas eliminar este chat? Esta acción no se puede deshacer.",
      buttons: [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await chatService.deleteChat(chat.id);
              if (error) throw error;
              CustomAlert.success(
                "Chat eliminado",
                "El chat ha sido eliminado correctamente"
              );
              onClose();
            } catch (error) {
              CustomAlert.error(
                "Error",
                "No se pudo eliminar el chat. Por favor, intenta nuevamente."
              );
            }
          },
        },
      ],
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.background.primary },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Opciones del chat
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>

          <UserInfo user={otherUser} theme={theme} />

          <ScrollView style={styles.options}>
            {!showMuteOptions ? (
              <>
                <OptionItem
                  icon="person-add-outline"
                  label="Enviar solicitud de amistad"
                  onPress={handleAddFriend}
                  theme={theme}
                />
                <OptionItem
                  icon="notifications-off-outline"
                  label="Silenciar notificaciones"
                  onPress={() => setShowMuteOptions(true)}
                  theme={theme}
                />
                {isBlocked ? (
                  <OptionItem
                    icon="checkmark-circle-outline"
                    label="Desbloquear usuario"
                    onPress={handleUnblock}
                    theme={theme}
                  />
                ) : (
                  <OptionItem
                    icon="ban-outline"
                    label="Bloquear usuario"
                    onPress={handleBlock}
                    destructive
                    theme={theme}
                  />
                )}
                <OptionItem
                  icon="trash-outline"
                  label="Eliminar chat"
                  onPress={handleDelete}
                  destructive
                  theme={theme}
                />
              </>
            ) : (
              <MuteOptions
                onBack={() => setShowMuteOptions(false)}
                onSelect={handleMute}
                theme={theme}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  options: {
    paddingHorizontal: 20,
  },
});
