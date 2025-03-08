import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Chat } from "../types";
import { CustomAlert } from "./CustomAlert";
import { chat as chatService } from "../services/chat";
import { supabase } from "../services/supabase";

interface ChatOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  chat: Chat;
  otherUser: any; // Mejorar este tipo cuando tengamos la definición completa
}

const MUTE_OPTIONS = [
  { label: "1 hora", value: 60 * 60 * 1000 },
  { label: "8 horas", value: 8 * 60 * 60 * 1000 },
  { label: "1 día", value: 24 * 60 * 60 * 1000 },
  { label: "1 semana", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "Siempre", value: -1 },
];

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
    const checkBlockStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Obtener el ID del otro usuario en el chat
        const { data: participants } = await supabase
          .from("chat_participants")
          .select("user_id")
          .eq("chat_id", chat.id)
          .neq("user_id", user.id);

        const otherId = participants?.[0]?.user_id;
        setOtherUserId(otherId);

        if (otherId) {
          // Verificar si el usuario está bloqueado
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

    if (visible) {
      checkBlockStatus();
    }
  }, [visible, chat.id]);

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

  const renderOption = (
    icon: string,
    label: string,
    onPress: () => void,
    destructive?: boolean
  ) => (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={24}
        color={destructive ? theme.status.error : theme.text.primary}
      />
      <Text
        style={[
          styles.optionText,
          {
            color: destructive ? theme.status.error : theme.text.primary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Opciones del chat
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            {otherUser?.avatar_url ? (
              <Image
                source={{ uri: otherUser.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.background.secondary },
                ]}
              >
                <Ionicons
                  name="person"
                  size={30}
                  color={theme.text.secondary}
                />
              </View>
            )}
            <Text style={[styles.username, { color: theme.text.primary }]}>
              {otherUser?.username ? `@${otherUser.username}` : "Usuario"}
            </Text>
          </View>

          {/* Options */}
          <ScrollView style={styles.options}>
            {!showMuteOptions ? (
              <>
                {renderOption(
                  "person-add-outline",
                  "Enviar solicitud de amistad",
                  handleAddFriend
                )}
                {renderOption(
                  "notifications-off-outline",
                  "Silenciar notificaciones",
                  () => setShowMuteOptions(true)
                )}
                {isBlocked
                  ? renderOption(
                      "checkmark-circle-outline",
                      "Desbloquear usuario",
                      handleUnblock
                    )
                  : renderOption(
                      "ban-outline",
                      "Bloquear usuario",
                      handleBlock,
                      true
                    )}
                {renderOption(
                  "trash-outline",
                  "Eliminar chat",
                  handleDelete,
                  true
                )}
              </>
            ) : (
              <>
                <View style={styles.muteHeader}>
                  <TouchableOpacity
                    onPress={() => setShowMuteOptions(false)}
                    style={styles.backButton}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={theme.text.primary}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[styles.muteTitle, { color: theme.text.primary }]}
                  >
                    Silenciar por
                  </Text>
                </View>
                {MUTE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.muteOption}
                    onPress={() => handleMute(option.value)}
                  >
                    <Text
                      style={[
                        styles.muteOptionText,
                        { color: theme.text.primary },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
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
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
  options: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  muteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  muteTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  muteOption: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  muteOptionText: {
    fontSize: 16,
  },
});
