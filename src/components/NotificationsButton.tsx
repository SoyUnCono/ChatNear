import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../services/supabase";

interface NotificationsButtonProps {
  onPress: () => void;
}

export const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  onPress,
}) => {
  const { theme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    subscribeToNotifications();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener solicitudes de amistad no leídas
      const { data: friendRequests, error: friendError } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .eq("read", false);

      if (friendError) throw friendError;

      setUnreadCount(friendRequests?.length || 0);
    } catch (error) {
      console.error("Error loading unread notifications:", error);
    }
  };

  const subscribeToNotifications = () => {
    const channel = supabase.channel("notifications");

    // Suscribirse a nuevas solicitudes de amistad
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friend_requests",
        },
        () => {
          loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name="notifications-outline"
        size={24}
        color={theme.text.primary}
      />
      {unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.action.primary }]}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});
