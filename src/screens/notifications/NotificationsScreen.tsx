import React, { useLayoutEffect } from "react";
import { View, StyleSheet, Switch, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.background.secondary,
      },
      headerTintColor: theme.text.primary,
      headerShadowVisible: false,
    });
  }, [navigation, theme]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <View
        style={[
          styles.section,
          { backgroundColor: theme.background.secondary },
        ]}
      >
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text.primary }]}>
            Notificaciones push
          </Text>
          <Switch value={true} onValueChange={() => {}} />
        </View>
        <Text style={[styles.description, { color: theme.text.secondary }]}>
          Recibe notificaciones cuando alguien te envía un mensaje
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
  },
});
