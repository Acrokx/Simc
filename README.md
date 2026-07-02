# SIMC - Sistema Inteligente de Monitoreo de Cultivos

Cristhian Esneider Enciso Jimenez  
Análisis y Desarrollo de Software - 3066478  
Servicio Nacional de Aprendizaje S.E.N.A  
Centro de Biotecnología Agropecuaria CBA  
Mosquera – Cundinamarca

## Descripción

Sistema móvil para la gestión inteligente de cultivos, monitoreo de sensores, control de riegos y generación de alertas en tiempo real.

## Tecnologías

**Backend:** Django + Django REST Framework  
**Frontend:** React Native + Expo  
**Base de datos:** SQLite (desarrollo)  
**API:** RESTful con autenticación básica

## Estructura del Proyecto

```
SIMC/
├── MiAppTareas/          # Aplicación móvil (React Native)
│   ├── app/              # Pantallas de la app
│   │   ├── _layout.tsx   # Layout principal
│   │   ├── index.tsx     # Pantalla de inicio
│   │   ├── login.tsx     # Autenticación
│   │   ├── home.tsx      # Panel principal
│   │   ├── fincas.tsx    # Gestión de fincas
│   │   ├── cultivos.tsx  # Gestión de cultivos
│   │   ├── sensores.tsx  # Gestión de sensores
│   │   ├── alertas.tsx   # Alertas del sistema
│   │   ├── admin.tsx     # Panel de administración
│   │   ├── api.ts        # Cliente HTTP
│   │   └── theme.ts      # Tema de la app
│   ├── app.json          # Configuración Expo
│   └── package.json
└── backend_cultivos/     # API Django
    ├── usuarios/         # Gestión de usuarios
    ├── cultivos/         # Fincas y cultivos
    ├── sensores/         # Sensores IoT
    ├── mediciones/       # Lecturas de sensores
    ├── alertas/          # Sistema de alertas
    ├── config/           # Configuración Django
    ├── init_users.py     # Script inicial de usuarios
    └── db.sqlite3        # Base de datos
```

## Instalación

### Backend (Django)

```bash
cd backend_cultivos
pip install -r requirements.txt
python init_users.py
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React Native)

```bash
cd MiAppTareas
npm install
# Configurar IP en app.json -> extra -> API_HOST
npm run android
```

## Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@simc.com | admin123 | Administrador |
| juan@simc.com | juan123456 | Agricultor |
| maria@simc.com | maria123456 | Agricultor |

## API Endpoints

- `POST /api/login/` - Iniciar sesión
- `POST /api/registro/` - Registrar usuario
- `GET /api/fincas/` - Listar fincas
- `GET /api/cultivos/` - Listar cultivos
- `GET /api/sensores/` - Listar sensores
- `GET /api/alertas/` - Listar alertas
- `GET /api/usuarios/agricultores/` - Listar agricultores

## Historias de Usuario Implementadas

- HU1: Registro de usuarios (Administrador)
- HU2: Inicio de sesión (Usuario)
- HU3: Registro de fincas (Agricultor)
- HU4: Registro de cultivos (Agricultor)
- HU5: Registro de sensores (Administrador)
- HU6: Visualización de datos (Agricultor)
- HU7: Generación de alertas (Usuario)
- HU8: Generación de reportes (Administrador)