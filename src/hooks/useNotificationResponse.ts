import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import {
  useNavigation,
  NavigationContainerRef,
} from "@react-navigation/native";
import {
  NotificationPayload,
  NotificationType,
} from "../services/notifications/pushNotifications";

export const useNotificationResponse = () => {
  // Mantener una referencia a la última notificación recibida cuando la app no estaba lista para navegar
  const pendingNotification = useRef<NotificationPayload | null>(null);
  const navigationReady = useRef(false);
  let navigation: any;

  try {
    navigation = useNavigation();
    navigationReady.current = true;
  } catch (error) {
    navigationReady.current = false;
  }

  useEffect(() => {
    // Si hay una notificación pendiente y la navegación está lista, procesarla
    if (navigationReady.current && pendingNotification.current) {
      handleNotificationResponse(pendingNotification.current);
      pendingNotification.current = null;
    }
  }, [navigationReady.current]);

  useEffect(() => {
    // Manejador de notificaciones cuando la app está en primer plano
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        const payload = notification.request.content
          .data as NotificationPayload;
        console.log("Received notification in foreground:", payload);
        // Aquí puedes manejar la notificación en primer plano
        // Por ejemplo, mostrar un toast, actualizar un badge, etc.
      });

    // Manejador cuando el usuario toca una notificación
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const payload = response.notification.request.content
          .data as NotificationPayload;
        if (!navigationReady.current) {
          // Si la navegación no está lista, guardar la notificación para procesarla después
          pendingNotification.current = payload;
          return;
        }
        handleNotificationResponse(payload);
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  // Manejar la respuesta según el tipo de notificación
  const handleNotificationResponse = (payload: NotificationPayload) => {
    if (!navigationReady.current || !navigation) {
      console.log("Navigation not ready, storing notification for later");
      pendingNotification.current = payload;
      return;
    }

    try {
      switch (payload.type) {
        case "message":
          navigation.navigate("Chat", {
            chatId: payload.data.chatId,
          });
          break;

        case "mention":
          navigation.navigate("Chat", {
            chatId: payload.data.chatId,
          });
          break;

        case "groupInvite":
          navigation.navigate("GroupDetails", {
            groupId: payload.data.groupId,
          });
          break;

        case "newMatch":
          navigation.navigate("Profile", {
            userId: payload.data.userId,
          });
          break;

        case "custom":
          if (payload.data.payload?.screen) {
            navigation.navigate(
              payload.data.payload.screen,
              payload.data.payload.params
            );
          }
          break;

        default:
          console.log("Unhandled notification type:", payload.type);
      }
    } catch (error) {
      console.error("Error handling notification navigation:", error);
    }
  };
};
