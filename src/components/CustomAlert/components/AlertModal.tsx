import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { styles } from "../styles";
import { AlertButton, AlertOptions } from "../types";
import { typeToIcon, typeToColor } from "../constants";

///
/// Props
///
interface AlertModalProps {
  ///
  /// Visible
  ///
  visible: boolean;

  ///
  /// Opciones
  ///
  options: AlertOptions;

  ///
  /// Cerrar
  ///
  onClose: () => void;
}

///
/// AlertModal
///
export const AlertModal: React.FC<AlertModalProps> = ({
  ///
  /// Visible
  ///
  visible,

  ///
  /// Opciones
  ///
  options,

  ///
  /// Cerrar
  ///
  onClose,
}) => {
  ///
  /// Tema
  ///
  const { theme, isDarkMode } = useTheme();

  ///
  /// Tipo
  ///
  const type = options.type || "info";

  ///
  /// Icono
  ///
  const iconName = options.icon || typeToIcon[type];

  ///
  /// Color
  ///
  const iconColor = typeToColor[type];

  ///
  /// Ordenar los botones
  ///
  const sortedButtons = [...(options.buttons || [])].sort((a, b) => {
    ///
    /// Cancelar al final
    ///
    if (a.style === "cancel") return 1;
    if (b.style === "cancel") return -1;

    ///
    /// Destructivo primero
    ///
    if (a.style === "destructive") return -1;

    ///
    /// Destructivo segundo
    ///
    if (b.style === "destructive") return 1;

    ///
    /// Default
    ///
    return 0;
  });

  ///
  /// Renderizado
  ///
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.4)",
          },
        ]}
        onPress={onClose}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(30, 30, 30, 0.98)"
                : "rgba(255, 255, 255, 0.98)",
            },
          ]}
        >
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={iconName as any} size={38} color={iconColor} />
            </View>
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              {options.title}
            </Text>
            {options.message && (
              <Text
                style={[
                  styles.modalMessage,
                  { color: isDarkMode ? "#A0A0A0" : "#666666" },
                ]}
              >
                {options.message}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.buttonContainer,
              {
                borderTopColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(60, 60, 67, 0.29)",
              },
            ]}
          >
            {sortedButtons.map((button, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <View
                    style={[
                      styles.buttonSeparator,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(60, 60, 67, 0.29)",
                      },
                    ]}
                  />
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    button.onPress?.();
                    onClose();
                  }}
                >
                  {button.icon && (
                    <Ionicons
                      name={button.icon as any}
                      size={20}
                      color={
                        button.style === "destructive"
                          ? styles.destructiveText.color
                          : button.style === "cancel"
                          ? isDarkMode
                            ? "#A0A0A0"
                            : styles.cancelText.color
                          : styles.defaultText.color
                      }
                      style={styles.buttonIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === "destructive"
                        ? styles.destructiveText
                        : button.style === "cancel"
                        ? [
                            styles.cancelText,
                            {
                              color: isDarkMode
                                ? "#A0A0A0"
                                : styles.cancelText.color,
                            },
                          ]
                        : styles.defaultText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
