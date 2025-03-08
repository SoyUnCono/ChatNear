import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import Color from "color";

interface AnimatedBackgroundProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  intensity?: number;
}

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  speed: number;
}

const NUM_PARTICLES = 15;
const { width, height } = Dimensions.get("window");

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  style,
  children,
  intensity = 0.2,
}) => {
  const { theme, isDarkMode } = useTheme();

  // Create gradient colors based on theme
  const gradientColors = isDarkMode
    ? ([
        // Dark mode - tonos oscuros pero no tan extremos
        Color("#121212").alpha(1).toString(),
        Color("#151515").alpha(1).toString(),
        Color("#181818").alpha(1).toString(),
        Color("#121212").alpha(1).toString(),
      ] as const)
    : ([
        // Light mode - tonos de blanco más definidos
        Color("#ffffff").alpha(0.98).toString(),
        Color("#fafafa").alpha(0.95).toString(),
        Color("#f8f8f8").alpha(0.93).toString(),
        Color("#ffffff").alpha(0.9).toString(),
      ] as const);

  // Crear sistema de partículas
  const particles = useMemo(() => {
    return Array.from({ length: NUM_PARTICLES }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
      opacity: new Animated.Value(Math.random() * 0.4 + 0.1),
      speed: Math.random() * 1000 + 1000,
    }));
  }, []);

  useEffect(() => {
    // Animación de partículas
    particles.forEach((particle) => {
      const animateParticle = () => {
        const animations = [
          Animated.timing(particle.y, {
            toValue: -50,
            duration: particle.speed * 2,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0.1,
            duration: particle.speed,
            useNativeDriver: true,
          }),
        ];

        Animated.parallel(animations).start(() => {
          particle.y.setValue(height + 50);
          particle.opacity.setValue(Math.random() * 0.4 + 0.1);
          animateParticle();
        });
      };

      particle.y.setValue(Math.random() * height);
      animateParticle();
    });

    return () => {
      particles.forEach((particle) => {
        particle.y.stopAnimation();
        particle.opacity.stopAnimation();
      });
    };
  }, [particles]);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.gradientContainer]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
          locations={[0, 0.3, 0.6, 1]}
        />
      </View>

      {/* Sistema de partículas */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
              backgroundColor: isDarkMode ? "#1e90ff" : "#4169e1",
            },
          ]}
        />
      ))}

      {children}
    </View>
  );
};

const GRADIENT_SIZE = Math.max(width, height) * 1.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "transparent",
  },
  gradientContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
