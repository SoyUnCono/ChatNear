import { SettingsStorage } from "../storage/settings";
import { supabase } from "../supabase";

///
/// Tipos de ajustes del chat
///
export interface ChatSettings {
  ///
  /// Modo anónimo
  ///
  anonymous_mode: boolean;

  ///
  /// Confirmación de lectura
  ///
  read_receipts: boolean;

  ///
  /// Indicador de escritura
  ///
  typing_indicator: boolean;

  ///
  /// Distancia en km
  ///
  distance_km: number;

  ///
  /// Rango de edad
  ///
  age_range: {
    min: number;
    max: number;
  };

  ///
  /// Filtro de género
  ///
  gender_filter: "all" | "male" | "female" | "other";

  ///
  /// Mostrar solo amigos de amigos
  ///
  friends_of_friends_only: boolean;

  ///
  /// Intereses comunes mínimos
  ///
  min_common_interests: number;
}

///
/// Configuración por defecto
///
const DEFAULT_SETTINGS: ChatSettings = {
  anonymous_mode: false,
  read_receipts: true,
  typing_indicator: true,
  distance_km: 30,
  age_range: {
    min: 18,
    max: 99,
  },
  gender_filter: "all",
  friends_of_friends_only: false,
  min_common_interests: 0,
};

///
/// Servicio de configuración del chat
///
class ChatSettingsService {
  ///
  /// Almacenamiento de configuración
  ///
  private storage: SettingsStorage<ChatSettings>;

  ///
  /// Constructor
  ///
  constructor() {
    this.storage = new SettingsStorage<ChatSettings>(
      "@chat_settings",
      DEFAULT_SETTINGS
    );
  }

  ///
  /// Obtener configuración
  ///
  async getSettings(): Promise<ChatSettings> {
    return await this.storage.getSettings();
  }

  ///
  /// Actualizar configuración
  ///
  async updateSettings(settings: Partial<ChatSettings>): Promise<void> {
    // Guardar en el almacenamiento local
    await this.storage.updateSettings(settings);

    // Si se está actualizando el modo anónimo, actualizar en la base de datos
    if ("anonymous_mode" in settings) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ is_anonymous: settings.anonymous_mode })
          .eq("id", user.id);
      }
    }
  }

  ///
  /// Actualizar estado de escritura
  ///
  async updateTypingStatus(chatId: string, isTyping: boolean): Promise<void> {
    if (
      !this.storage.getSettings().then((settings) => settings.typing_indicator)
    ) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("chat_participants")
        .update({ is_typing: isTyping })
        .eq("chat_id", chatId)
        .eq("user_id", user.id);
    }
  }

  ///
  /// Marcar mensaje como leído
  ///
  async markMessageAsRead(messageId: string): Promise<void> {
    if (
      !this.storage.getSettings().then((settings) => settings.read_receipts)
    ) {
      return;
    }

    await supabase.from("messages").update({ read: true }).eq("id", messageId);
  }
}

///
/// Exportar instancia del servicio
///
export const chatSettings = new ChatSettingsService();
