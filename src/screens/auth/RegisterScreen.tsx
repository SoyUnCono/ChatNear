import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../contexts/AuthContext";
import { AvatarPicker } from "../../components/AvatarPicker";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

////
/// Componente
////
export const RegisterScreen: React.FC = () => {
  ////
  /// Input del Email
  ////
  const [email, setEmail] = useState("");

  /// Input de la contraseña
  ////
  const [password, setPassword] = useState("");

  /// Input del nombre de usuario
  ////
  const [username, setUsername] = useState("");

  /// Estado del avatar
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  /// Estado del loading
  const [loading, setLoading] = useState(false);

  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Autenticación
  ////
  const { signUp } = useAuth();

  ////
  /// Manejador de registro
  ////
  const handleRegister = async () => {
    ////
    /// Validar que los campos no estén vacíos
    /// y si lo estan, mostrar un alert con un mensaje de error
    ////
    if (!email || !password || !username) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    ////
    /// Indicar que se está realizando una operación
    /// de carga.
    ////
    setLoading(true);

    ////
    /// Iniciar el registro, manejar el error y finalizar la carga
    /// de la operación. En caso de éxito, navegar a la pantalla de inicio.
    /// En caso de error, mostrar un alert con un mensaje de error.
    ////
    try {
      await signUp({
        email,
        password,
        username,
        avatarUri: avatarUri || undefined,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error al registrarse"
      );
    } finally {
      setLoading(false);
    }
  };

  ////
  /// Renderizado
  ////
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>ChatNear</Text>
            <Text style={styles.subtitle}>Crea tu cuenta</Text>
          </View>

          <AvatarPicker imageUri={avatarUri} onImageSelected={setAvatarUri} />

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Registrando..." : "Registrarse"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
            >
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#666",
    marginRight: 5,
  },
  footerLink: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
