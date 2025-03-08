import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../contexts/ThemeContext";

const MUTE_OPTIONS = [
  { label: "1 hora", value: 60 * 60 * 1000 },
  { label: "8 horas", value: 8 * 60 * 60 * 1000 },
  { label: "1 día", value: 24 * 60 * 60 * 1000 },
  { label: "1 semana", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "Siempre", value: -1 },
];

interface MuteOptionsProps {
  onBack: () => void;
  onSelect: (duration: number) => void;
  theme: Theme;
}

export const MuteOptions: React.FC<MuteOptionsProps> = ({
  onBack,
  onSelect,
  theme,
}) => {
  return (
    <>
      <View style={styles.muteHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.muteTitle, { color: theme.text.primary }]}>
          Silenciar por
        </Text>
      </View>
      {MUTE_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.muteOption}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[styles.muteOptionText, { color: theme.text.primary }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  muteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  muteTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  muteOption: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  muteOptionText: {
    fontSize: 16,
  },
});
