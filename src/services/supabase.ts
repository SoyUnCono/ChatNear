import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

///
/// Variables de entorno
///

////
/// Verificar si las variables de entorno están definidas
/// Si no están definidas, lanzar un error
////
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

///
/// Crear el cliente de Supabase
///
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  ///
  /// Configuración del cliente de Supabase
  ///
  auth: {
    ///
    /// Almacenar el token en el almacenamiento local
    ///
    storage: AsyncStorage,
    ///
    /// Refrescar el token automáticamente
    ///
    autoRefreshToken: true,
    ///
    /// Mantener la sesión
    ///
    persistSession: true,
    ///
    /// Detectar la sesión en la URL
    ///
    detectSessionInUrl: false,
  },
});
