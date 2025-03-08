import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import { RandomChatButton } from "../../../components/RandomChatButton";
import Color from "color";

///
/// Props
///
interface SearchingOverlayProps {
  ///
  /// Cancelar
  ///
  onCancel: () => void;
}

///
/// SearchingOverlay
///
export const SearchingOverlay: React.FC<SearchingOverlayProps> = ({
  ///
  /// Cancelar
  ///
  onCancel,
}) => {
  ///
  /// Tema
  ///
  const { theme, isDarkMode } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  // Crear colores para el efecto glass
  const glassBackground = isDarkMode
    ? Color(theme.background.primary).alpha(0.7).toString()
    : Color(theme.background.primary).alpha(0.8).toString();

  const glassOverlay = isDarkMode
    ? Color(theme.background.secondary).alpha(0.3).toString()
    : Color(theme.background.secondary).alpha(0.2).toString();

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  const opacityInterpolation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const buttonStyle = {
    position: "relative" as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: isDarkMode
      ? Color(theme.background.secondary).alpha(0.9).toString()
      : Color(theme.background.primary).alpha(0.9).toString(),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  };

  ///
  /// Renderizado
  ///
  return (
    <BlurView
      intensity={isDarkMode ? 40 : 60}
      tint={isDarkMode ? "dark" : "light"}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.glassEffect,
          {
            backgroundColor: glassBackground,
            opacity: opacityInterpolation,
          },
        ]}
      >
        <LinearGradient
          colors={[glassOverlay, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <View style={styles.searchingContent}>
            <ActivityIndicator
              color={theme.text.primary}
              size="large"
              style={styles.spinner}
            />
            <Text style={[styles.text, { color: theme.text.primary }]}>
              Buscando personas cercanas...
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <RandomChatButton
              label="Cancelar Búsqueda"
              onPress={onCancel}
              variant="secondary"
              containerStyle={buttonStyle}
            />
          </View>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.select({ ios: 24, android: 16 }),
    left: 16,
    right: 16,
    overflow: "hidden",
    borderRadius: 24,
  },
  glassEffect: {
    width: "100%",
    padding: 24,
    borderRadius: 24,
    overflow: "hidden",
  },
  content: {
    width: "100%",
  },
  searchingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
  spinner: {
    marginRight: 16,
    transform: [{ scale: 1.2 }],
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});
