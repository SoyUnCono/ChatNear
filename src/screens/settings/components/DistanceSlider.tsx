import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";

interface DistanceSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const DistanceSlider: React.FC<DistanceSliderProps> = ({
  value,
  onValueChange,
}) => {
  const { theme } = useTheme();

  const formatDistance = (km: number) => {
    if (km >= 1000) {
      return "Sin límite";
    }
    return `${km} km`;
  };

  return (
    <View
      style={[styles.container, { borderBottomColor: theme.border.primary }]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="location-outline"
            size={22}
            color={theme.icon.secondary}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Distancia máxima
          </Text>
        </View>
        <Text style={[styles.value, { color: theme.text.secondary }]}>
          {formatDistance(value)}
        </Text>
      </View>
      <Slider
        containerStyle={styles.slider}
        minimumValue={1}
        maximumValue={1000}
        step={1}
        value={value}
        onValueChange={([val]) => onValueChange(val)}
        minimumTrackTintColor={theme.action.primary}
        maximumTrackTintColor={theme.border.primary}
        thumbTintColor={theme.action.primary}
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
      />
      <View style={styles.labels}>
        <Text style={[styles.label, { color: theme.text.secondary }]}>
          1 km
        </Text>
        <Text style={[styles.label, { color: theme.text.secondary }]}>
          Sin límite
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
