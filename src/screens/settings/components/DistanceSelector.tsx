import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface DistanceSelectorProps {
  value: "nearby" | "30km" | "international";
  onValueChange: (value: "nearby" | "30km" | "international") => void;
}

export const DistanceSelector: React.FC<DistanceSelectorProps> = ({
  value,
  onValueChange,
}) => {
  const { theme } = useTheme();

  const options = [
    { value: "nearby", label: "Cercano", icon: "location-outline" },
    { value: "30km", label: "30 km", icon: "map-outline" },
    { value: "international", label: "Internacional", icon: "globe-outline" },
  ] as const;

  return (
    <>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.item,
            {
              borderBottomColor: theme.border.primary,
              borderBottomWidth:
                index === options.length - 1 ? 0 : StyleSheet.hairlineWidth,
            },
          ]}
          onPress={() => onValueChange(option.value)}
        >
          <View style={styles.leftContent}>
            <Ionicons
              name={option.icon}
              size={22}
              color={theme.icon.secondary}
              style={styles.icon}
            />
            <Text style={[styles.label, { color: theme.text.primary }]}>
              {option.label}
            </Text>
          </View>
          {value === option.value && (
            <Ionicons name="checkmark" size={22} color={theme.action.primary} />
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 17,
  },
});
