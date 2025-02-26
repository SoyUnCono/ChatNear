// Tipos para el formulario de perfil
export interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
}

// Props para el campo de entrada
export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  loading?: boolean;
  theme: any;
  options?: {
    placeholder?: string;
    multiline?: boolean;
    autoCapitalize?: "none" | "sentences";
  };
}

// Props para el botón de guardar
export interface SaveButtonProps {
  onPress: () => void;
  loading: boolean;
  theme: any;
}
