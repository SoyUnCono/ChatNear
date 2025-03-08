import React from "react";
import { ScrollView, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { useChatSettings } from "../hooks/useChatSettings";
import { Header } from "../../../components/Header";
import {
  DistanceSection,
  AgeSection,
  GenderSection,
  PreferencesSection,
} from "./components";

export const SearchFiltersScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { settings, updateSetting } = useChatSettings();

  return (
    <SafeAreaView style={[styles.container]} edges={["top"]}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
      />

      <ScrollView
        style={[styles.content, { backgroundColor: "transparent" }]}
        contentContainerStyle={styles.contentContainer}
      >
        <DistanceSection
          value={settings.distance_km}
          onValueChange={(value) => updateSetting("distance_km", value)}
        />

        <AgeSection
          value={settings.age_range}
          onValueChange={(value) => updateSetting("age_range", value)}
        />

        <GenderSection
          value={settings.gender_filter}
          onValueChange={(value) => updateSetting("gender_filter", value)}
        />

        <PreferencesSection
          friendsOfFriendsOnly={settings.friends_of_friends_only}
          minCommonInterests={settings.min_common_interests}
          onFriendsOfFriendsChange={(value) =>
            updateSetting("friends_of_friends_only", value)
          }
          onCommonInterestsChange={(value) =>
            updateSetting("min_common_interests", value)
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
});
