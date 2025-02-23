import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

////
/// Componente : Botón para iniciar un chat aleatorio
////
export const RandomChatButton: React.FC = () => {
  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Evento : Iniciar chat aleatorio
  ////
  const handlePress = () => {
    navigation.navigate("RandomChat");
  };

  ////
  /// Renderizado
  ////
  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>Iniciar Chat Aleatorio</Text>
    </TouchableOpacity>
  );
};

////
/// Estilos
////
const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
