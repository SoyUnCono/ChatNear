import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { RandomChatButton } from "../../../components/RandomChatButton";

interface SearchingOverlayProps {
  onCancel: () => void;
}

export const SearchingOverlay: React.FC<SearchingOverlayProps> = ({
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.action.primary }]}>
      <ActivityIndicator color="white" style={styles.spinner} />
      <Text style={styles.text}>Buscando personas cercanas...</Text>
      <RandomChatButton
        label="Cancelar"
        onPress={onCancel}
        variant="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spinner: {
    marginRight: 12,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});
