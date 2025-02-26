import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SaveButtonProps } from "../types";

export const SaveButton: React.FC<SaveButtonProps> = ({
  onPress,
  loading,
  theme,
}) => (
  <TouchableOpacity
    style={[
      styles.saveButton,
      {
        backgroundColor: theme.action.primary,
        opacity: loading ? 0.7 : 1,
      },
    ]}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <>
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="white"
          style={styles.saveButtonIcon}
        />
      </>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  saveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  saveButtonIcon: {
    marginLeft: 4,
  },
});
