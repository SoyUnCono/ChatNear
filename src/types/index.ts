///
/// Usuario
///
export interface User {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  status: "online" | "offline";
  last_seen: string | null;
}

///
/// Chat
///
export interface Chat {
  id: string;
  created_at: string;
  otherUser: User;
  lastMessage?: Message;
  unreadCount: number;
  is_anonymous: boolean;
}

///
/// Mensaje
///
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender_id: string;
  chat_id: string;
  read: boolean;
}

///
/// Preferencias del usuario
///
export interface UserPreferences {
  language: string;
  distance_filter: "nearby" | "30km" | "international";
  notification_enabled: boolean;
  theme: "light" | "dark";
}
