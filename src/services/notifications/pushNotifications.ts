import * as Notifications from "expo-notifications";

///
/// Tipo de notificación
///
export type NotificationType =
  ///
  /// Notificación de mensaje
  ///
  | "message"
  ///
  /// Notificación de mención
  ///
  | "mention"
  ///
  /// Notificación de invitación a grupo
  ///
  | "groupInvite"
  ///
  /// Notificación de nuevo match
  ///
  | "newMatch"
  ///
  /// Notificación personalizada
  ///
  | "custom";

///
/// Datos de la notificación
///
interface BaseNotificationData {
  ///
  /// Tipo de notificación
  ///
  type: NotificationType;
  ///
  /// Datos de la notificación
  ///
  data?: Record<string, any>;
}

///
/// Notificación de mensaje
///
interface MessageNotification extends BaseNotificationData {
  ///
  /// Tipo de notificación
  ///
  type: "message";
  ///
  /// Datos de la notificación
  ///
  data: {
    ///
    /// Id del remitente
    ///
    senderId: string;
    ///
    /// Nombre del remitente
    ///
    senderName: string;
    ///
    /// Id del chat
    ///
    chatId: string;
    ///
    /// Mensaje
    ///
    message: string;
  };
}

///
/// Notificación de mención
///
interface MentionNotification extends BaseNotificationData {
  ///
  /// Tipo de notificación
  ///
  type: "mention";
  ///
  /// Datos de la notificación
  ///
  data: {
    ///
    /// Id del usuario
    ///
    userId: string;
    ///
    /// Nombre del usuario
    ///
    userName: string;
    ///
    /// Id del chat
    ///
    chatId: string;
  };
}

///
/// Notificación de invitación a grupo
///
interface GroupInviteNotification extends BaseNotificationData {
  ///
  /// Tipo de notificación
  ///
  type: "groupInvite";
  ///
  /// Datos de la notificación
  ///
  data: {
    ///
    /// Id del grupo
    ///
    groupId: string;
    ///
    /// Nombre del grupo
    ///
    groupName: string;
    ///
    /// Id del invitador
    ///
    inviterId: string;
    ///
    /// Nombre del invitador
    ///
    inviterName: string;
  };
}

///
/// Notificación de nuevo match
///
interface NewMatchNotification extends BaseNotificationData {
  ///
  /// Tipo de notificación
  ///
  type: "newMatch";
  ///
  /// Datos de la notificación
  ///
  data: {
    ///
    /// Id del usuario
    ///
    userId: string;
    ///
    /// Nombre del usuario
    ///
    userName: string;
    ///
    /// Puntuación del match
    ///
    matchScore: number;
    ///
    /// Id del chat
    ///
    chatId: string;
  };
}

///
/// Notificación personalizada
///
interface CustomNotification extends BaseNotificationData {
  ///
  /// Tipo de notificación
  ///
  type: "custom";
  ///
  /// Datos de la notificación
  ///
  data: {
    ///
    /// Titulo de la notificación
    ///
    title: string;
    ///
    /// Cuerpo de la notificación
    ///
    body: string;
    ///
    /// Datos de la notificación
    ///
    payload?: Record<string, any>;
  };
}

///
/// Tipo de notificación
///
export type NotificationPayload =
  ///
  /// Notificación de mensaje
  ///
  | MessageNotification
  ///
  /// Notificación de mención
  ///
  | MentionNotification
  ///
  /// Notificación de invitación a grupo
  ///
  | GroupInviteNotification
  ///
  /// Notificación de nuevo match
  ///
  | NewMatchNotification
  ///
  /// Notificación personalizada
  ///
  | CustomNotification;

///
/// Servicio de notificaciones push
///
class PushNotificationService {
  ///
  /// Enviar una notificación de mensaje nuevo
  ///
  async sendMessageNotification({
    ///
    /// Id del remitente
    ///
    senderId,
    ///
    /// Nombre del remitente
    ///
    senderName,
    ///
    /// Id del chat
    ///
    chatId,
    ///
    /// Mensaje
    ///
    message,
  }: MessageNotification["data"]) {
    ///
    /// Retornar la notificación
    ///
    return await this.scheduleNotification({
      ///
      /// Titulo de la notificación
      ///
      title: senderName,
      ///
      /// Cuerpo de la notificación
      ///
      body: message,
      ///
      /// Datos de la notificación
      ///
      data: {
        ///
        /// Tipo de notificación
        ///
        type: "message",
        ///
        /// Datos de la notificación
        ///
        data: {
          ///
          /// Id del remitente
          ///
          senderId,
          ///
          /// Nombre del remitente
          ///
          senderName,
          ///
          /// Id del chat
          ///
          chatId,
          ///
          /// Mensaje
          ///
          message,
        },
      },
    });
  }

  ///
  /// Enviar una notificación de mención
  ///
  async sendMentionNotification({
    ///
    /// Id del usuario
    ///
    userId,
    ///
    /// Nombre del usuario
    ///
    userName,
    ///
    /// Id del chat
    ///
    chatId,
  }: MentionNotification["data"]) {
    ///
    /// Retornar la notificación
    ///
    return await this.scheduleNotification({
      ///
      /// Titulo de la notificación
      ///
      title: "Nueva mención",
      ///
      /// Cuerpo de la notificación
      ///
      body: `${userName} te ha mencionado en un chat`,
      ///
      /// Datos de la notificación
      ///
      data: {
        ///
        /// Tipo de notificación
        ///
        type: "mention",
        ///
        /// Datos de la notificación
        ///
        data: {
          ///
          /// Id del usuario
          ///
          userId,
          ///
          /// Nombre del usuario
          ///
          userName,
          ///
          /// Id del chat
          ///
          chatId,
        },
      },
    });
  }
  ///
  /// Enviar una notificación de invitación a grupo
  ///
  async sendGroupInviteNotification({
    ///
    /// Id del grupo
    ///
    groupId,
    ///
    /// Nombre del grupo
    ///
    groupName,
    ///
    /// Id del invitador
    ///
    inviterId,
    ///
    /// Nombre del invitador
    ///
    inviterName,
  }: GroupInviteNotification["data"]) {
    return await this.scheduleNotification({
      ///
      /// Titulo de la notificación
      ///
      title: "Invitación a grupo",
      ///
      /// Cuerpo de la notificación
      ///
      body: `${inviterName} te ha invitado a unirte a ${groupName}`,
      ///
      /// Datos de la notificación
      ///
      data: {
        ///
        /// Tipo de notificación
        ///
        type: "groupInvite",
        ///
        /// Datos de la notificación
        ///
        data: {
          ///
          /// Id del grupo
          ///
          groupId,
          ///
          /// Nombre del grupo
          ///
          groupName,
          ///
          /// Id del invitador
          ///
          inviterId,
          ///
          /// Nombre del invitador
          ///
          inviterName,
        },
      },
    });
  }

  ///
  /// Enviar una notificación de nuevo match
  ///
  async sendNewMatchNotification({
    ///
    /// Id del usuario
    ///
    userId,
    ///
    /// Nombre del usuario
    ///
    userName,
    ///
    /// Puntuación del match
    ///
    matchScore,
    ///
    /// Id del chat
    ///
    chatId,
  }: NewMatchNotification["data"]) {
    ///
    /// Retornar la notificación
    ///
    return await this.scheduleNotification({
      ///
      /// Titulo de la notificación
      ///
      title: "¡Nuevo match!",
      ///
      /// Cuerpo de la notificación
      ///
      body: `Has hecho match con ${userName} (${matchScore}% de compatibilidad)`,
      ///
      /// Datos de la notificación
      ///
      data: {
        ///
        /// Tipo de notificación
        ///
        type: "newMatch",
        ///
        /// Datos de la notificación
        ///
        data: {
          ///
          /// Id del usuario
          ///
          userId,
          ///
          /// Nombre del usuario
          ///
          userName,
          ///
          /// Puntuación del match
          ///
          matchScore,
          ///
          /// Id del chat
          ///
          chatId,
        },
      },
    });
  }
  ///
  /// Enviar una notificación personalizada
  ///
  async sendCustomNotification({
    ///
    /// Titulo de la notificación
    ///
    title,
    ///
    /// Cuerpo de la notificación
    ///
    body,
    ///
    /// Datos de la notificación
    ///
    payload,
  }: CustomNotification["data"]) {
    ///
    /// Retornar la notificación
    ///
    return await this.scheduleNotification({
      ///
      /// Titulo de la notificación
      ///
      title,
      ///
      /// Cuerpo de la notificación
      ///
      body,
      ///
      /// Datos de la notificación
      ///
      data: {
        ///
        /// Tipo de notificación
        ///
        type: "custom",
        ///
        /// Datos de la notificación
        ///
        data: {
          ///
          /// Titulo de la notificación
          ///
          title,
          ///
          /// Cuerpo de la notificación
          ///
          body,
          ///
          /// Datos de la notificación
          ///
          payload,
        },
      },
    });
  }

  ///
  /// Método base para programar notificaciones
  ///
  private async scheduleNotification({
    ///
    /// Titulo de la notificación
    ///
    title,
    ///
    /// Cuerpo de la notificación
    ///
    body,
    ///
    /// Datos de la notificación
    ///
    data,
  }: {
    ///
    /// Titulo de la notificación
    ///
    title: string;
    ///
    /// Cuerpo de la notificación
    ///
    body: string;
    ///
    data: NotificationPayload;
  }) {
    ///
    /// Intentar programar la notificación
    ///
    try {
      ///
      /// Programar la notificación
      ///
      const notificationId = await Notifications.scheduleNotificationAsync({
        ///
        /// Contenido de la notificación
        ///
        content: {
          ///
          /// Titulo de la notificación
          ///
          title,
          ///
          /// Cuerpo de la notificación
          ///
          body,
          ///
          /// Datos de la notificación
          ///
          data,
          ///
          /// Sonido de la notificación
          ///
          sound: "default",
          ///
          /// Badge de la notificación
          ///
          badge: 1,
        },
        ///
        /// Trigger de la notificación
        ///
        trigger: null,
      });

      ///
      /// Retornar el id de la notificación
      ///
      return notificationId;
    } catch (error) {
      ///
      /// Imprimir el error
      ///
      console.error("Error scheduling notification:", error);
      ///
      /// Lanzar el error
      ///
      throw error;
    }
  }
}
///
/// Exportar la instancia de la clase
///
export const pushNotifications = new PushNotificationService();
