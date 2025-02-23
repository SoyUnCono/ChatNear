///
/// Usuario
///
export interface User {
  id: string;
  created_at: string;
  username: string;
  avatar_url?: string;
  status: "online" | "offline";
  last_seen?: string;
  bio?: string;
  is_premium?: boolean;
  is_incognito?: boolean;
}

///
/// Chat
///
export interface Chat {
  id: string;
  created_at: string;
  participants: string[];
  last_message?: string;
  last_message_at?: string;
  is_anonymous: boolean;
  is_pinned?: boolean;
}

///
/// Mensaje
///
export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
  read_at?: string;
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
