///
/// Usuario
///
export interface User {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  status: "online" | "offline";
  last_seen: string | null;
}

///
/// Estado del chat
///
export type ChatStatus = "active" | "ended" | "blocked";

///
/// Tipo de chat
///
export type ChatType = "random" | "direct";

///
/// Mensaje de la base de datos
///
export interface DbMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  image_url: string | null;
  sender?: {
    id: string;
    name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

///
/// Mensaje completo
///
export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  sent: boolean;
  read: boolean;
  read_at?: string;
  read_by?: Array<{
    user_id: string;
    read_at: string;
  }>;
  is_system?: boolean;
  image_url?: string | null;
  sender?: User;
}

///
/// Participante de la base de datos
///
export interface DbParticipant {
  user_id: string;
  joined_at: string;
  last_read: string;
  is_typing: boolean;
  has_requested_end: boolean;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatar_url: string | null;
    status: "online" | "offline";
  };
}

///
/// Participante completo
///
export interface ChatParticipant extends Omit<DbParticipant, "user"> {
  chat_id: string;
  user?: User;
}

///
/// Chat de la base de datos
///
export interface DbChat {
  id: string;
  type: ChatType;
  status: ChatStatus;
  created_at: string;
  ended_at: string | null;
  is_anonymous: boolean;
  participants: DbParticipant[];
  messages: DbMessage[];
}

///
/// Chat completo
///
export interface Chat extends Omit<DbChat, "participants" | "messages"> {
  participants?: ChatParticipant[];
  messages?: Message[];
  lastMessage?: Message;
  unreadCount?: number;
}

///
/// Respuesta de Supabase para chat_participants
///
export interface ChatParticipantResponse {
  chat: DbChat;
}

///
/// Cola de chat aleatorio
///
export interface RandomQueueEntry {
  id: string;
  user_id: string;
  created_at: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  max_distance: number;
}

///
/// Preferencias del usuario
///
export interface UserPreferences {
  language: string;
  distance_filter: "nearby" | "30km" | "international";
  notification_enabled: boolean;
  theme: "light" | "dark" | "system";
}
