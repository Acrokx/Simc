# SIMC - Frontend (Expo/React Native)

Aplicación móvil del Sistema Inteligente de Monitoreo de Cultivos desarrollada con Expo.

## 📱 Descripción

Interfaz móvil para monitorear cultivos, registrar sensores, capturar mediciones de humedad y recibir alertas.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
npx expo start
```

### Requisitos

- Node.js 18+
- Expo Go o un emulador compatible
- Configurar la IP del backend en `app.json` o `app/api.ts`

## 📁 Estructura de Archivos

```
app/
├── _layout.tsx            # Layout principal de navegación
├── index.tsx              # Pantalla inicial
├── login.tsx              # Login de usuarios
├── home.tsx               # Navegación principal
├── agricultor.tsx         # Dashboard para agricultor
├── admin-dashboard.tsx    # Dashboard para administrador
├── admin.tsx              # Gestión de usuarios
├── fincas.tsx             # Gestión de fincas
├── cultivos.tsx           # Gestión de cultivos
├── sensores.tsx           # Gestión de sensores
├── mediciones.tsx         # Registro y consulta de mediciones
├── alertas.tsx            # Visualización de alertas
├── clima.tsx              # Vista de clima y pronóstico
├── api.ts                 # Cliente HTTP hacia el backend
├── theme.ts               # Tema y estilos compartidos
└── hooks.ts               # Helpers de navegación
```

## 🔌 Integración con API

El frontend usa la API REST del backend Django en el puerto `8000`.

- URL base: `http://<IP_DEL_SERVIDOR>:8000/api`
- Ajusta `API_HOST` en `app/api.ts` o en `app.json`

## 📋 Funcionalidades Principales

- Login y redireccionamiento por rol
- Gestión de fincas y cultivos
- Registro de sensores con código y ubicación
- Captura de mediciones de humedad por sensor
- Simulación de mediciones automáticas
- Visualización de alertas generadas por niveles de humedad fuera de rango
- Dashboard de agricultor y administrador

## 🛠️ Scripts

- `npm start` | Iniciar servidor Expo
- `npm run android` | Abrir en Android
- `npm run ios` | Abrir en iOS
- `npm run web` | Abrir en navegador

## 📌 Notas

- El módulo de mediciones permite registrar valores reales o simular lecturas.
- Las alertas se generan automáticamente cuando los niveles de humedad son demasiado bajos o altos.
- El sistema está pensado para integrar sensores reales en una fase posterior.
