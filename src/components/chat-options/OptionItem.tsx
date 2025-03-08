import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../../contexts/ThemeContext";

interface OptionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  theme: Theme;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  icon,
  label,
  onPress,
  destructive,
  theme,
}) => {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={24}
        color={destructive ? theme.status.error : theme.text.primary}
      />
      <Text
        style={[
          styles.optionText,
          {
            color: destructive ? theme.status.error : theme.text.primary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
});
