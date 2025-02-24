import React, { useCallback } from "react";
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useTheme } from "../../contexts/ThemeContext";
import { BlurView } from "expo-blur";
import { NavigationMenuProps, NavigationMenuItem } from "./types";
import { MenuItem } from "./MenuItem";
import { MENU_ITEMS } from "./constants";
import { styles } from "./styles";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

///
/// Componente NavigationMenu
///
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  ///
  /// Estado: Visible
  ///
  visible,

  ///
  /// Evento: Cerrar
  ///
  onClose,
}) => {
  ///
  /// Hooks
  ///
  const navigation = useNavigation<NavigationProp>();

  ///
  /// Tema
  ///
  const { theme, isDarkMode } = useTheme();

  ///
  /// Evento: Navegar
  ///
  const handleNavigate = useCallback(
    ///
    /// Item
    ///
    (item: NavigationMenuItem) => {
      ///
      /// Si no hay parámetros, navegar al item
      ///
      if (!item.params) {
        navigation.navigate(item.name as any);
      }

      ///
      /// Si hay parámetros, navegar al item con los parámetros
      ///
      navigation.navigate(item.name, item.params);

      ///
      /// Cerrar
      ///
      onClose();
    },
    [navigation, onClose]
  );

  ///
  /// Si no está visible, no renderizar
  ///
  if (!visible) return null;

  ///
  /// Renderizado
  ///
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.75)" },
          ]}
        />
        <SafeAreaView style={styles.container} pointerEvents="box-none">
          <Pressable style={styles.menuWrapper}>
            <BlurView
              intensity={100}
              tint={isDarkMode ? "dark" : "light"}
              style={[
                styles.blurContainer,
                { backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF" },
              ]}
            >
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.3)",
                  },
                ]}
              />

              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>
                Menú
              </Text>

              <View style={styles.menuContent}>
                {MENU_ITEMS.map((item) => (
                  <MenuItem
                    key={item.name}
                    item={item}
                    onNavigate={handleNavigate}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </View>
            </BlurView>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};
