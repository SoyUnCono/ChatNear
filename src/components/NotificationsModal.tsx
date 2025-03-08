import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../services/supabase";
import { useNavigation } from "@react-navigation/native";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

type Notification = {
  id: string;
  type: "friend_request";
  title: string;
  message: string;
  created_at: string;
  data: any;
  read: boolean;
};

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  const loadNotifications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener solicitudes de amistad con información del perfil del remitente
      const { data: friendRequests, error: friendError } = await supabase
        .from("friend_requests")
        .select(
          `
          id,
          created_at,
          read,
          sender:sender_id(
            id,
            email,
            raw_user_meta_data->>username as username,
            raw_user_meta_data->>name as name
          )
        `
        )
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (friendError) throw friendError;

      // Transformar las solicitudes en notificaciones
      const notificationsList = (friendRequests || []).map((request: any) => ({
        id: request.id,
        type: "friend_request" as const,
        title: "Nueva solicitud de amistad",
        message: `${
          request.sender?.username || request.sender?.name || "Usuario"
        } quiere ser tu amigo`,
        created_at: request.created_at,
        data: request,
        read: request.read,
      }));

      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleFriendRequest = async (
    notification: Notification,
    accept: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({
          status: accept ? "accepted" : "rejected",
          read: true,
        })
        .eq("id", notification.id);

      if (error) throw error;

      // Recargar notificaciones
      loadNotifications();
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const renderNotification = (notification: Notification) => {
    switch (notification.type) {
      case "friend_request":
        return (
          <View
            key={notification.id}
            style={[
              styles.notification,
              !notification.read && {
                backgroundColor: theme.background.secondary,
              },
            ]}
          >
            <View style={styles.notificationContent}>
              <Text style={[styles.title, { color: theme.text.primary }]}>
                {notification.title}
              </Text>
              <Text style={[styles.message, { color: theme.text.secondary }]}>
                {notification.message}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.action.primary },
                ]}
                onPress={() => handleFriendRequest(notification, true)}
              >
                <Text
                  style={[styles.actionText, { color: theme.text.inverse }]}
                >
                  Aceptar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.status.error },
                ]}
                onPress={() => handleFriendRequest(notification, false)}
              >
                <Text
                  style={[styles.actionText, { color: theme.text.inverse }]}
                >
                  Rechazar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
              Notificaciones
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView
            style={styles.notificationsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.text.primary}
              />
            }
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={theme.text.secondary}
                />
                <Text
                  style={[styles.emptyText, { color: theme.text.secondary }]}
                >
                  No tienes notificaciones
                </Text>
              </View>
            ) : (
              notifications.map(renderNotification)
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  notificationsList: {
    paddingHorizontal: 20,
  },
  notification: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  notificationContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});
