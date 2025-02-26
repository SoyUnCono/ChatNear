import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { InputFieldProps } from "../types";

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  loading,
  theme,
  options,
}) => (
  <View
    style={[
      styles.inputContainer,
      { backgroundColor: theme.background.secondary },
    ]}
  >
    <Text style={[styles.label, { color: theme.text.primary }]}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        options?.multiline && styles.bioInput,
        { color: theme.text.primary },
      ]}
      placeholder={options?.placeholder}
      placeholderTextColor={theme.text.tertiary}
      value={value}
      onChangeText={onChangeText}
      editable={!loading}
      multiline={options?.multiline}
      autoCapitalize={options?.autoCapitalize}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    fontSize: 17,
    marginBottom: 6,
    fontWeight: "400",
  },
  input: {
    fontSize: 17,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
});
