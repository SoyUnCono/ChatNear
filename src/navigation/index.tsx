import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, AuthStackParamList } from "./types";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { useAuth } from "../contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { Header } from "../components/Header";

// TODO: ==> Importaremos las pantallas más adelante
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

////
/// Navegador de autenticación
////
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

////
/// Navegador de la aplicación
////
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={() => null} />
      <Stack.Screen name="Profile" component={() => null} />
      <Stack.Screen name="Favorites" component={() => null} />
      <Stack.Screen name="Settings" component={() => null} />
      <Stack.Screen name="RandomChat" component={() => null} />
      <Stack.Screen name="Notifications" component={() => null} />
      <Stack.Screen name="ChatList" component={() => null} />
    </Stack.Navigator>
  );
};

////
/// Navegación
////
export function Navigation() {
  ////
  /// Obtener el usuario y el estado de carga
  ////
  const { user, loading } = useAuth();

  ////
  /// Si el usuario está cargando, mostrar un indicador de carga
  ////
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  ////
  /// Si el usuario no está autenticado, mostrar el navegador de autenticación
  ////
  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
