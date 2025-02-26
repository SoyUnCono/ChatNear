import { User } from "../../types";

import { Chat } from "../../types";

import { Message } from "../../types";

// Tipos para las props del componente ChatScreen
export interface ChatScreenProps {
  chatId: string;
}

// Tipos para el estado del header
export interface ChatHeaderProps {
  otherUser: User | null;
  chat: Chat | null;
  onEndChat: () => void;
  theme: any; // TODO: Definir tipo específico del tema
}

// Tipos para el componente de mensaje
export interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  theme: any; // TODO: Definir tipo específico del tema
}

// Tipos para el componente de entrada de mensaje
export interface MessageInputProps {
  onSend: (message: string) => void;
  theme: any; // TODO: Definir tipo específico del tema
}
