import React from "react";
import { ScrollView, StyleSheet, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/types";
import { Section } from "./components/Section";
import { SwitchItem } from "./components/SwitchItem";
import { useChatSettings } from "./hooks/useChatSettings";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const SettingsScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { settings, updateSetting } = useChatSettings();

  return (
    <SafeAreaView style={[styles.container]} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
      />

      <ScrollView
        style={[styles.content, { backgroundColor: "transparent" }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Ajustes de Chat */}
        <Section title="AJUSTES DE CHAT">
          <SwitchItem
            title="Modo anónimo"
            subtitle="Oculta tu perfil al chatear con nuevas personas"
            value={settings.anonymous_mode}
            onValueChange={(value) => updateSetting("anonymous_mode", value)}
            icon="eye-off-outline"
          />
          <SwitchItem
            title="Confirmación de lectura"
            subtitle="Mostrar cuando has leído los mensajes"
            value={settings.read_receipts}
            onValueChange={(value) => updateSetting("read_receipts", value)}
            icon="checkmark-done-outline"
          />
          <SwitchItem
            title="Indicador de escritura"
            subtitle="Mostrar cuando estás escribiendo"
            value={settings.typing_indicator}
            onValueChange={(value) => updateSetting("typing_indicator", value)}
            icon="create-outline"
          />
        </Section>

        {/* Filtros de Búsqueda */}
        <Section
          title="BÚSQUEDA"
          description="Personaliza cómo encontrar nuevos chats"
        >
          <SwitchItem
            title="Filtros de búsqueda"
            subtitle="Distancia, edad, género y más"
            onPress={() => navigation.navigate("SearchFilters")}
            icon="options-outline"
            isLink
          />
        </Section>

        {/* Pais */}
        <Section title="PAIS">
          <SwitchItem
            title="Región"
            subtitle="España"
            onPress={() => navigation.navigate("RegionSettings")}
            icon="globe-outline"
            isLink
          />
        </Section>

        {/* Ajustes de Usuario */}
        <Section
          title="AJUSTES DE USUARIO"
          description="Personaliza tu perfil y preferencias."
        >
          <SwitchItem
            title="Editar perfil"
            onPress={() => navigation.navigate("EditProfile")}
            icon="person-outline"
            isLink
          />
          <SwitchItem
            title="Cambiar contraseña"
            onPress={() => navigation.navigate("ChangePassword")}
            icon="key-outline"
            isLink
          />
          {/* <SwitchItem
            title="Verificación en dos pasos"
            onPress={() => navigation.navigate("TwoFactorAuth")}
            icon="lock-closed-outline"
            isLink
          /> */}
        </Section>

        {/* Notificaciones y Privacidad */}
        <Section
          title="NOTIFICACIONES Y PRIVACIDAD"
          description="Gestiona la privacidad y seguridad de tu cuenta."
        >
          <SwitchItem
            title="Notificaciones"
            onPress={() => navigation.navigate("NotificationSettings")}
            icon="notifications-outline"
            isLink
          />
          <SwitchItem
            title="Privacidad"
            onPress={() => navigation.navigate("PrivacySettings")}
            icon="lock-closed-outline"
            isLink
          />
          <SwitchItem
            title="Seguridad"
            onPress={() => navigation.navigate("SecuritySettings")}
            icon="shield-outline"
            isLink
          />
        </Section>

        {/* Información y Ayuda
        <Section title="INFORMACIÓN Y AYUDA">
          <SwitchItem
            title="Acerca de"
            onPress={() => navigation.navigate("AboutSettings")}
            icon="information-circle-outline"
            isLink
          />
          <SwitchItem
            title="Ayuda"
            onPress={() => navigation.navigate("HelpSettings")}
            icon="help-circle-outline"
            isLink
          />
        </Section> */}

        {/* Sesión */}
        <Section title="SESIÓN">
          <SwitchItem
            title="Cerrar Sesión"
            onPress={signOut}
            icon="log-out-outline"
            textColor={theme.status.error}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  sectionDescription: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
