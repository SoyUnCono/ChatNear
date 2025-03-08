import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Slider } from "@miblanchard/react-native-slider";
import { Ionicons } from "@expo/vector-icons";

interface AgeRangeSelectorProps {
  value: { min: number; max: number };
  onValueChange: (value: { min: number; max: number }) => void;
}

export const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({
  value = { min: 18, max: 99 }, // Valor por defecto
  onValueChange,
}) => {
  const { theme } = useTheme();

  // Asegurarse de que los valores sean válidos
  const safeValue = {
    min: Math.max(18, Math.min(value?.min || 18, 99)),
    max: Math.max(18, Math.min(value?.max || 99, 99)),
  };

  // Asegurarse de que min no sea mayor que max
  if (safeValue.min > safeValue.max) {
    safeValue.min = safeValue.max;
  }

  return (
    <View
      style={[styles.container, { borderBottomColor: theme.border.primary }]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="calendar-outline"
            size={22}
            color={theme.icon.secondary}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Rango de edad
          </Text>
        </View>
        <Text style={[styles.value, { color: theme.text.secondary }]}>
          {safeValue.min} - {safeValue.max} años
        </Text>
      </View>
      <View style={styles.slidersContainer}>
        <Slider
          containerStyle={styles.slider}
          minimumValue={18}
          maximumValue={99}
          step={1}
          value={safeValue.min}
          onValueChange={([val]) =>
            onValueChange({
              min: Math.min(val, safeValue.max - 1),
              max: safeValue.max,
            })
          }
          minimumTrackTintColor={theme.action.primary}
          maximumTrackTintColor={theme.border.primary}
          thumbTintColor={theme.action.primary}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
        />
        <Slider
          containerStyle={styles.slider}
          minimumValue={18}
          maximumValue={99}
          step={1}
          value={safeValue.max}
          onValueChange={([val]) =>
            onValueChange({
              min: safeValue.min,
              max: Math.max(val, safeValue.min + 1),
            })
          }
          minimumTrackTintColor={theme.action.primary}
          maximumTrackTintColor={theme.border.primary}
          thumbTintColor={theme.action.primary}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
        />
      </View>
      <View style={styles.labels}>
        <Text style={[styles.label, { color: theme.text.secondary }]}>
          18 años
        </Text>
        <Text style={[styles.label, { color: theme.text.secondary }]}>
          99 años
        </Text>
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
    marginBottom: 8,
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
  value: {
    fontSize: 15,
  },
  slidersContainer: {
    marginTop: 8,
  },
  slider: {
    marginHorizontal: -8,
    height: 40,
  },
  track: {
    height: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
  },
});
