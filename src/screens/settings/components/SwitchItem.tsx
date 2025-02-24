import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

////
/// Tipos
////
interface SwitchItemProps {
  ///
  /// Título
  ///
  title: string;

  ///
  /// Subtítulo
  ///
  subtitle?: string;

  ///
  /// Valor
  ///
  value?: boolean;

  ///
  /// Cambiar valor
  ///
  onValueChange?: (value: boolean) => void;

  ///
  /// Presionar
  ///
  onPress?: () => void;

  ///
  /// Icono
  ///
  icon?: keyof typeof Ionicons.glyphMap;

  ///
  /// Es enlace
  ///
  isLink?: boolean;

  ///
  /// Texto color
  ///
  textColor?: string;
}

////
/// Componente : Item de switch
////
export const SwitchItem: React.FC<SwitchItemProps> = ({
  ///
  /// Título
  ///
  title,

  ///
  /// Subtítulo
  ///
  subtitle,

  ///
  /// Valor
  ///
  value,

  ///
  /// Cambiar valor
  ///
  onValueChange,

  ///
  /// Presionar
  ///
  onPress,

  ///
  /// Icono
  ///
  icon,

  ///
  /// Es enlace
  ///
  isLink,

  ///
  /// Texto color
  ///
  textColor,
}) => {
  ///
  /// Tema
  ///
  const { theme } = useTheme();

  ///
  /// Contenido
  ///
  const content = (
    <>
      {icon && (
        <Ionicons
          name={icon}
          size={22}
          color={textColor || theme.icon.secondary}
          style={styles.itemIcon}
        />
      )}
      <View style={[styles.itemText, !icon && styles.itemTextNoIcon]}>
        <Text
          style={[styles.itemTitle, { color: textColor || theme.text.primary }]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.itemSubtitle, { color: theme.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {isLink ? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.icon.secondary}
        />
      ) : (
        onValueChange && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: Platform.select({ ios: "#e9e9ea", android: "#767577" }),
              true: theme.action.primary,
            }}
            thumbColor={Platform.select({
              ios: "#FFFFFF",
              android: value ? theme.action.primary : "#f4f3f4",
            })}
            ios_backgroundColor="#e9e9ea"
          />
        )
      )}
    </>
  );

  ///
  /// Estilo del contenedor
  ///
  const containerStyle = [
    styles.item,
    { borderBottomColor: theme.border.primary },
  ];

  return onPress ? (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={containerStyle}>{content}</View>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
  itemIcon: {
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  itemText: {
    flex: 1,
    marginRight: 8,
    marginLeft: 0,
  },
  itemTextNoIcon: {
    marginLeft: 40,
  },
  itemTitle: {
    fontSize: 17,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
