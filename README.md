# ChatNear

Aplicación móvil de chat aleatorio que permite conectar con personas cercanas de forma anónima o mediante perfiles personalizados.

## Ramas

- `development` - Rama principal de desarrollo
- `main` - Rama de producción/releases

## Tecnologías

- React Native con Expo
- TypeScript
- Supabase (Backend y Autenticación)

## Configuración del Proyecto

### Prerrequisitos

- Node.js
- Expo CLI
- Cuenta en Supabase

### Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/SoyUnCono/ChatNear.git
cd ChatNear
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto:

```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key
```

4. Iniciar el proyecto:

```bash
npx expo start
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── screens/       # Pantallas de la aplicación
├── services/      # Servicios (Supabase, etc.)
├── contexts/      # Contextos de React
├── types/         # Definiciones de TypeScript
└── navigation/    # Configuración de navegación
```

## Características Principales

- Autenticación de usuarios
- Chats aleatorios
- Perfiles personalizables con avatares
- Sistema de chat en tiempo real
- Modo anónimo
- Gestión de perfiles

## Desarrollo

Para contribuir al proyecto:

1. Crear una nueva rama desde `development`
2. Realizar los cambios
3. Crear un Pull Request a `development`

## Estado del Proyecto

En desarrollo activo. Versión actual: 0.1.0
