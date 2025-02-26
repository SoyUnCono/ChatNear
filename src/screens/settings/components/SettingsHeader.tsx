import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

////
/// Tipos
////

interface SettingsHeaderProps {
  ///
  /// Título
  ///
  title: string;

  ///
  /// Título del botón de regreso
  ///
  backTitle?: string;
}

////
/// Componente : Encabezado de ajustes
////
export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  ///
  /// Título
  ///
  title,
  backTitle = "Ajustes",
}) => {
  ///
  /// Tema
  ///
  const { theme, isDarkMode } = useTheme();

  ///
  /// Navegación
  ///
  const navigation = useNavigation();

  ////
  /// Renderizado
  ////
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.background.primary,
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          style={{ marginRight: 23 }}
          color={theme.action.primary}
        />
        <Text style={[styles.backText, { color: theme.action.primary }]}>
          {backTitle}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === "ios" ? 44 : 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    left: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 17,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
});
