import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../contexts/ThemeContext";
import { AvatarPicker } from "../../../../components/AvatarPicker";
import { Section } from "../../components/Section";
import { Header } from "../../../../components/Header/Header";
import { useNavigation } from "@react-navigation/native";
import { InputField } from "./components/InputField";
import { SaveButton } from "./components/SaveButton";
import { useProfileForm } from "./hooks/useProfileForm";

////
/// Componente : Editar perfil
////
export const EditProfile: React.FC = () => {
  ///
  /// Hooks
  ///
  const { theme } = useTheme();

  ///
  /// Navegación
  ///
  const navigation = useNavigation();

  ///
  /// Estado del formulario
  ///
  const {
    ///
    /// Estado del formulario
    ///
    loading,
    ///
    /// Avatar
    ///
    avatarUri,
    ///
    /// Formulario
    ///
    formData,
    ///
    /// Setear el formulario
    ///
    setFormData,
    ///
    /// Manejar la imagen seleccionada
    ///
    handleImageSelected,
    ///
    /// Guardar el formulario
    ///
    handleSaveProfile,
  } = useProfileForm();

  ///
  /// Configurar el header
  ///
  useLayoutEffect(() => {
    ///
    /// Navegación
    ///
    navigation.setOptions({
      ///
      /// Header
      ///
      header: () => (
        <Header
          title="Editar Perfil"
          isSettingsStyle={true}
          backTitle="Ajustes"
        />
      ),
      ///
      /// Mostrar el header
      ///
      headerShown: true,
    });
  }, [navigation]);

  ///
  /// Renderizado
  ///
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        <Section title="FOTO DE PERFIL">
          <AvatarPicker
            imageUri={avatarUri}
            onImageSelected={handleImageSelected}
          />
        </Section>

        <Section title="INFORMACIÓN PERSONAL">
          <InputField
            label="Nombre"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            loading={loading}
            theme={theme}
          />
          <InputField
            label="Nombre de usuario"
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
            loading={loading}
            theme={theme}
            options={{
              placeholder: "@username",
              autoCapitalize: "none",
            }}
          />
          <InputField
            label="Biografía"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            loading={loading}
            theme={theme}
            options={{
              placeholder: "Cuéntanos sobre ti...",
              multiline: true,
            }}
          />
        </Section>

        <SaveButton
          onPress={handleSaveProfile}
          loading={loading}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
