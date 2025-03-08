import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { CustomAlert } from "../../components/CustomAlert";
import { AnimatedBackground } from "../../components/AnimatedBackground";

////
/// Tipos
////
type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

////
/// Componente
////
export const LoginScreen: React.FC = () => {
  ////
  /// Input del Email
  ////
  const [email, setEmail] = useState("");

  ///
  /// Input de la contraseña
  ///
  const [password, setPassword] = useState("");

  ///
  /// Estado del loading
  ///
  const [loading, setLoading] = useState(false);

  ///
  /// Estado para mostrar/ocultar la contraseña
  ///
  const [showPassword, setShowPassword] = useState(false);

  ////
  /// Navegación
  ////
  const navigation = useNavigation<NavigationProp>();

  ////
  /// Autenticación
  ////
  const { signIn } = useAuth();

  ////
  /// Tema
  ////
  const { theme } = useTheme();

  ////
  /// Manejador de login
  const handleLogin = async () => {
    if (!email || !password) {
      CustomAlert.error("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    await signIn(email, password)
      .catch((error) =>
        CustomAlert.error(
          "Error",
          error instanceof Error ? error.message : "Error al iniciar sesión"
        )
      )
      .finally(() => setLoading(false));
  };

  ////
  /// Renderizado
  ////
  return (
    <AnimatedBackground intensity={0.15}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: "transparent" }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.action.primary }]}>
              ChatNear
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Inicia sesión para continuar
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.icon.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background.secondary,
                    color: theme.text.primary,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.text.tertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.icon.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background.secondary,
                    color: theme.text.primary,
                  },
                ]}
                placeholder="Contraseña"
                placeholderTextColor={theme.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.icon.secondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.action.primary },
                loading && { backgroundColor: theme.action.disabled },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons
                    name="sync"
                    size={24}
                    color={theme.text.inverse}
                    style={styles.loadingIcon}
                  />
                  <Text
                    style={[styles.buttonText, { color: theme.text.inverse }]}
                  >
                    Iniciando sesión...
                  </Text>
                </View>
              ) : (
                <Text
                  style={[styles.buttonText, { color: theme.text.inverse }]}
                >
                  Iniciar Sesión
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text.secondary }]}>
              ¿No tienes una cuenta?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text
                style={[styles.footerLink, { color: theme.action.primary }]}
              >
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    borderRadius: 12,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    marginRight: 5,
  },
  footerLink: {
    fontWeight: "600",
  },
});
