import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";

////
/// Tipos
////
interface SectionProps {
  ///
  /// Título
  ///
  title: string;

  ///
  /// Descripción
  ///
  description?: string;

  ///
  /// Contenido
  ///
  children: React.ReactNode;
}

////
/// Componente : Sección
////
export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
}) => {
  ///
  /// Tema
  ///
  const { theme } = useTheme();

  ////
  /// Renderizado
  ////
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
          {title}
        </Text>
        {description && (
          <Text
            style={[styles.sectionDescription, { color: theme.text.secondary }]}
          >
            {description}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: theme.background.secondary },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  header: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionContent: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
  },
});
