# SIMC - Sistema Inteligente de Monitoreo de Cultivos

Rediseño completo de la interfaz móvil manteniendo toda la lógica del backend.

## 🎨 Cambios realizados

### Nueva paleta de colores
- Fondo blanco (#FFFFFF)
- Verde principal: #22C55E
- Verde oscuro: #15803D
- Gris claro: #F1F5F9

### Componentes reutilizables
- `DashboardHeader` - Encabezado con saludo, finca y notificaciones
- `FarmBanner` - Banner panorámico del cultivo con estado
- `MetricCard` - Tarjeta de métricas con barra de progreso
- `CropCard` - Tarjeta de cultivo con imagen y datos
- `AlertCard` - Tarjeta de alerta con iconos por tipo
- `RecommendationCard` - Tarjeta de recomendaciónIA
- `BottomNav` - Navegación inferior moderna

### Pantallas rediseñadas
- **Home** - Dashboard con banner, tarjetas 2x2, alertas y recomendación IA
- **Cultivos** - Lista de tarjetas grandes + formulario
- **Detalle Cultivo** - Métricas + gráficos de tendencia + botón riego
- **Alertas** - Lista de alertas con iconos por severidad
- **Perfil** - Información de usuario con avatar
- **Admin Dashboard** - Panel administrativo moderno
- **Mediciones** - Estadísticas con métricas y registro
- **Login** - Diseño limpio con overlay verde
- **Index** - Pantalla de bienvenida con features

### Navegación inferior (5 tabs)
1. 🏠 Inicio
2. 🌱 Cultivos
3. 📊 Estadísticas
4. 🚨 Alertas
5. 👤 Perfil

### Configuración técnica
- `app.json` actualizado con:
  - `usesCleartextTraffic: true` (Android)
  - `NSAppTransportSecurity` configurado (iOS)
  - Permisos de red

## ⚠️ Dependencias requeridas

Antes de correr, instala:

```bash
cd MiAppTareas
npm install
npm install react-native-chart-kit react-native-svg
```

> Nota: Si `npm install` se cuelga en Windows, usa:
> ```bash
> npm install --legacy-peer-deps
> ```

## 🚀 Ejecutar

```bash
# Backend
cd backend_cultivos
python run_server.py

# Frontend (en otra terminal)
cd MiAppTareas
npm start
```

## 📱 Características UI

- Fondo blanco limpio
- Tarjetas con sombras suaves y bordes redondeados (16-24px)
- Espaciado generoso entre componentes
- Tipografía moderna (Inter-style)
- Diseño minimalista y moderno tipo IoT
- Gráficas de líneas suaves (react-native-chart-kit)
- Iconos emoji para máxima compatibilidad
- Estados de carga y vacío mejorados

## 🔒 Conexión

El problema de conexión en dispositivo físico puede deberse a:
- Android bloquea HTTP por defecto → solucionado con `usesCleartextTraffic: true`
- iOS bloquea HTTP por ATS → solucionado con config en `app.json`
- Backend no bindeado a `0.0.0.0` → ya está configurado en `run_server.py`
- Firewall de Windows → verifica puerto 8000 abierto

## 📁 Estructura

```
MiAppTareas/
├── app/
│   ├── index.tsx          # Pantalla inicio/bienvenida
│   ├── login.tsx          # Login rediseñado
│   ├── home.tsx           # Dashboard principal
│   ├── cultivos.tsx       # Lista de cultivos
│   ├── detalle-cultivo.tsx # Detalle con gráficos
│   ├── alertas.tsx        # Lista de alertas
│   ├── perfil.tsx         # Perfil usuario
│   ├── admin-dashboard.tsx # Panel admin
│   ├── admin.tsx          # Gestión usuarios
│   ├── mediciones.tsx     # Estadísticas
│   ├── clima.tsx          # Pronóstico clima
│   ├── api.ts             # Cliente HTTP
│   └── theme.ts           # Paleta de colores
├── components/
│   └── ui/
│       ├── BottomNav.tsx
│       ├── ChartCard.tsx
│       ├── DashboardHeader.tsx
│       ├── FarmBanner.tsx
│       ├── MetricCard.tsx
│       ├── CropCard.tsx
│       ├── AlertCard.tsx
│       ├── RecommendationCard.tsx
│       ├── premium.tsx
│       └── navigation.tsx
└── lib/
    └── storage.ts
```
