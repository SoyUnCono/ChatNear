import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface GenderSelectorProps {
  value: "all" | "male" | "female" | "other";
  onValueChange: (value: "all" | "male" | "female" | "other") => void;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  value,
  onValueChange,
}) => {
  const { theme } = useTheme();

  const options = [
    { value: "all", label: "Todos los géneros", icon: "people-outline" },
    { value: "male", label: "Hombres", icon: "man-outline" },
    { value: "female", label: "Mujeres", icon: "woman-outline" },
    { value: "other", label: "Otros", icon: "person-outline" },
  ] as const;

  return (
    <View
      style={[styles.container, { borderBottomColor: theme.border.primary }]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="transgender-outline"
            size={22}
            color={theme.icon.secondary}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Mostrar
          </Text>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor:
                  value === option.value
                    ? theme.action.primaryTransparent
                    : "transparent",
                borderColor: theme.border.primary,
              },
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Ionicons
              name={option.icon}
              size={22}
              color={
                value === option.value
                  ? theme.action.primary
                  : theme.icon.secondary
              }
              style={styles.optionIcon}
            />
            <Text
              style={[
                styles.optionLabel,
                {
                  color:
                    value === option.value
                      ? theme.action.primary
                      : theme.text.primary,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 17,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionLabel: {
    fontSize: 15,
  },
});
