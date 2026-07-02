# MANUAL TÉCNICO - SIMC

## Sistema Inteligente de Monitoreo de Cultivos

**Versión:** 2.0 RC  
**Fecha:** Julio 2026  
**Proyecto:** SIMC  
**Estado:** Release Candidate

---

## 1. INTRODUCCIÓN

### 1.1 Propósito
Este documento describe la arquitectura técnica, estructura del sistema, tecnologías utilizadas y detalles de implementación del sistema SIMC en su versión candidata a producción.

### 1.2 Alcance
SIMC es una aplicación web/móvil con backend REST para la gestión integral de cultivos agrícolas, incluyendo gestión de fincas, cultivos, sensores, mediciones, alertas, riego, estadísticas y generación de reportes PDF/Excel/CSV.

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Arquitectura General
```
┌─────────────────────────────────────────────────────────────┐
│              APLICACIÓN WEB / MÓVIL (Expo)                  │
│           React Native + Expo Router + TypeScript           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                              │
│              Django 6.0.3 + DRF 3.15+                      │
│                    Puerto: 8000                             │
│  - Exception handler global                                 │
│  - CORS por origen configurable                             │
│  - Auth por header X-Usuario / X-Password                   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                            │
│                    SQLite (desarrollo)                      │
│              PostgreSQL / MySQL (producción)                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Componentes

| Componente | Tecnología | Función |
|------------|------------|---------|
| Frontend | React Native + Expo Router + TypeScript | Interfaz web/móvil |
| Backend API | Django 6.0.3 + DRF | Lógica de negocio y API REST |
| Base de Datos | SQLite / PostgreSQL | Almacenamiento de datos |
| Reportes | ReportLab + CSV | Generación de PDF/CSV |
| Protocolo | HTTP/REST + JSON | Comunicación cliente-servidor |

---

## 3. ESTRUCTURA DEL PROYECTO

### 3.1 Directorio Principal
```
SIMC/
├── backend_cultivos/                # Backend Django
│   ├── config/
│   │   ├── settings.py              # Configuración por entorno
│   │   ├── urls.py                  # Rutas principales
│   │   ├── exception_handler.py     # Manejador global de errores
│   │   ├── wsgi.py / asgi.py
│   ├── usuarios/
│   │   ├── models.py                # Usuario
│   │   ├── views.py                 # Auth, CRUD, eliminar seguro
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── cultivos/
│   │   ├── models.py                # Finca, Cultivo, HistorialRiego
│   │   ├── views.py                 # ViewSets + dashboard
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── sensores/
│   │   ├── models.py                # Sensor
│   │   ├── views.py                 # SensorViewSet + acciones
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── mediciones/
│   │   ├── models.py                # Medicion
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── alertas/
│   │   ├── models.py                # Alerta
│   │   ├── views.py                 # ViewSet + endpoints auxiliares
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── configuracion/
│   │   ├── models.py                # ConfiguracionInteligente, ConfiguracionSistema
│   │   ├── views.py                 # Umbrales, sistema, reportes, estadísticas
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── common/
│   │   ├── mixins.py                # AdminRequiredMixin, AdminOrOwnerRequiredMixin
│   │   └── auth.py                  # is_administrador
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
└── MiAppTareas/                     # Frontend Expo
    ├── app/
    │   ├── _layout.tsx
    │   ├── index.tsx                # Pantalla de inicio
    │   ├── (auth)/                  # Login, recuperar-password, reset-password
    │   ├── (admin)/                 # Rutas administrador
    │   │   ├── dashboard.tsx
    │   │   ├── usuarios/
    │   │   ├── fincas/
    │   │   ├── cultivos/
    │   │   ├── sensores/
    │   │   ├── mediciones.tsx
    │   │   ├── alertas/
    │   │   ├── reportes/
    │   │   ├── configuracion/
    │   │   └── perfil/
    │   └── (agricultor)/            # Rutas agricultor
    │       ├── dashboard.tsx
    │       ├── mis-fincas/
    │       ├── mis-cultivos/
    │       ├── sensores/
    │       ├── riego/
    │       ├── estadisticas/
    │       ├── alertas/
    │       ├── reportes/
    │       └── perfil/
    ├── components/
    │   ├── ui/                       # Componentes reutilizables
    │   │   ├── BottomNav.tsx
    │   │   ├── navigation.tsx
    │   │   ├── DashboardHeader.tsx
    │   │   ├── MetricCard.tsx
    │   │   ├── AlertCard.tsx
    │   │   ├── RecommendationCard.tsx
    │   │   ├── BarChart.tsx
    │   │   ├── SensorStatus.tsx
    │   │   ├── Loading.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── ...
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   └── Breadcrumb.tsx
    │   └── navigation/
    │       ├── AdminNavigation.tsx
    │       └── FarmerNavigation.ts
    ├── services/
    │   └── api.ts                    # Cliente HTTP centralizado
    ├── lib/
    │   ├── storage.ts                # AsyncStorage + SecureStore
    │   └── download.ts               # Descarga de blobs PDF/CSV
    ├── theme/
    │   └── index.ts                  # Paleta de colores
    ├── package.json
    └── app.json
```

---

## 4. MODELOS DE DATOS

### 4.1 Usuario
**Tabla:** `usuario`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_usuario | AutoField (PK) | Identificador único |
| nombre | CharField(100) | Nombre |
| apellido | CharField(100) | Apellido |
| correo | CharField(100) | Correo electrónico único |
| contraseña | CharField(255) | Contraseña hasheada |
| telefono | CharField(20) | Teléfono opcional |
| rol | CharField(20) | `Administrador` o `Agricultor` |
| bloqueado | BooleanField | Estado de bloqueo |

### 4.2 Finca
**Tabla:** `finca`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_finca | AutoField (PK) | Identificador único |
| nombre_finca | CharField(100) | Nombre |
| ubicacion | CharField(150) | Ubicación geográfica |
| tamaño_hectareas | DecimalField(10,2) | Tamaño en hectáreas |
| tipo_cultivo | CharField(100) | Tipo de cultivo |
| estado | CharField(50) | `activa` / `inactiva` |
| descripcion | TextField | Descripción opcional |
| imagen | TextField | Imagen opcional |
| id_usuario | ForeignKey | Usuario propietario |

### 4.3 Cultivo
**Tabla:** `cultivo`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_cultivo | AutoField (PK) | Identificador único |
| nombre_cultivo | CharField(100) | Nombre |
| tipo_cultivo | CharField(100) | Tipo |
| ubicacion | CharField(150) | Ubicación dentro de la finca |
| tamaño_area | DecimalField(10,2) | Área en hectáreas |
| fecha_siembra | DateField | Fecha de siembra |
| estado | CharField(50) | Estado actual |
| imagen | TextField | Imagen opcional |
| id_finca | ForeignKey | Finca asociada |

### 4.4 HistorialRiego
**Tabla:** `historial_riego`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_riego | AutoField (PK) | Identificador único |
| fecha_riego | DateField | Fecha del riego |
| cantidad_agua | DecimalField(10,2) | Litros |
| id_cultivo | ForeignKey | Cultivo relacionado |

### 4.5 Sensor
**Tabla:** `sensor`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_sensor | AutoField (PK) | Identificador único |
| codigo_sensor | CharField(50, unique) | Código único |
| tipo_sensor | CharField(50) | Tipo: humedad, temperatura, etc. |
| ubicacion | CharField(100) | Ubicación física |
| estado | CharField(50) | Estado |
| activo | BooleanField | Estado operativo |
| frecuencia_minutos | PositiveIntegerField | Frecuencia de lectura |
| rango_min | FloatField | Rango mínimo |
| rango_max | FloatField | Rango máximo |
| id_cultivo | ForeignKey | Cultivo monitoreado |

### 4.6 Medicion
**Tabla:** `medicion`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_medicion | AutoField (PK) | Identificador único |
| valor_humedad | DecimalField(6,2) | Valor de humedad (%) |
| fecha_medicion | DateTimeField | Fecha y hora (auto) |
| id_sensor | ForeignKey | Sensor que generó la medición |

### 4.7 Alerta
**Tabla:** `alerta`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_alerta | AutoField (PK) | Identificador único |
| tipo_alerta | CharField(50) | Tipo de alerta |
| descripcion | TextField | Descripción |
| fecha_alerta | DateTimeField | Fecha de creación (auto) |
| prioridad | CharField(20) | `alta`, `media`, `baja` |
| leida | BooleanField | Indicador de lectura |
| atendida | BooleanField | Indicador de atención |
| id_sensor | ForeignKey | Sensor relacionado (opcional) |
| id_medicion | ForeignKey | Medición relacionada (opcional) |

### 4.8 ConfiguraciónInteligente
**Tabla:** `configuracion_inteligente`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | AutoField (PK) | Identificador único |
| tipo | CharField(30) | Tipo: humedad_suelo, temperatura, etc. |
| valor_minimo | FloatField | Umbral mínimo |
| valor_maximo | FloatField | Umbral máximo |
| activa | BooleanField | Estado de la regla |
| mensaje_alerta | CharField(255) | Mensaje personalizado |
| prioridad | CharField(20) | Prioridad de la alerta |

### 4.9 ConfiguracionSistema
**Tabla:** `configuracion_sistema`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| clave | CharField(100, unique) | Clave de configuración |
| valor | TextField | Valor |
| descripcion | CharField(255) | Descripción |
| actualizado_en | DateTimeField | Fecha de actualización (auto) |

---

## 5. API REST - ENDPOINTS

### 5.1 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login/` | Iniciar sesión |
| POST | `/api/logout/` | Cerrar sesión |
| POST | `/api/registro/` | Registro público |

### 5.2 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios/` | Listar usuarios (admin) |
| POST | `/api/usuarios/` | Crear usuario (admin) |
| PATCH | `/api/usuarios/<id>/` | Actualizar usuario (admin) |
| DELETE | `/api/usuarios/<id>/` | Eliminar usuario (admin) |
| GET | `/api/usuarios/agricultores/` | Listar agricultores |
| PATCH | `/api/usuarios/editar/<id>/` | Editar agricultor |
| DELETE | `/api/usuarios/eliminar/<id>/` | Eliminar agricultor |

### 5.3 Dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/` | Estadísticas generales |

### 5.4 Fincas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/fincas/` | Listar fincas |
| POST | `/api/fincas/` | Crear finca |
| GET | `/api/fincas/<id>/` | Detalle |
| PATCH | `/api/fincas/<id>/` | Actualizar |
| DELETE | `/api/fincas/<id>/` | Eliminar |
| GET | `/api/fincas/?id_usuario=<id>` | Filtrar por usuario |

### 5.5 Cultivos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cultivos/` | Listar cultivos |
| POST | `/api/cultivos/` | Crear cultivo |
| GET | `/api/cultivos/<id>/` | Detalle |
| PATCH | `/api/cultivos/<id>/` | Actualizar |
| DELETE | `/api/cultivos/<id>/` | Eliminar |
| GET | `/api/cultivos/?id_finca=<id>` | Filtrar por finca |

### 5.6 Riegos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/riegos/` | Listar riegos |
| POST | `/api/riegos/` | Registrar riego |
| GET | `/api/riegos/<id>/` | Detalle |
| PATCH | `/api/riegos/<id>/` | Actualizar riego |
| DELETE | `/api/riegos/<id>/` | Eliminar riego |
| GET | `/api/riegos/?id_cultivo=<id>` | Filtrar por cultivo |

### 5.7 Sensores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sensores/` | Listar sensores |
| POST | `/api/sensores/` | Crear sensor |
| GET | `/api/sensores/<id>/` | Detalle |
| PATCH | `/api/sensores/<id>/` | Actualizar sensor |
| DELETE | `/api/sensores/<id>/` | Eliminar sensor |
| POST | `/api/sensores/<id>/toggle/` | Activar/desactivar |
| PATCH | `/api/sensores/<id>/configurar/` | Configurar parámetros |
| GET | `/api/sensores/<id>/historial_mediciones/` | Historial de mediciones |

### 5.8 Mediciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/mediciones/` | Listar mediciones |
| POST | `/api/mediciones/` | Crear medición |
| GET | `/api/mediciones/ultima/?id_sensor=<id>` | Última medición |
| POST | `/api/mediciones/simular/` | Simular mediciones |
| GET | `/api/mediciones/<id>/` | Detalle |
| DELETE | `/api/mediciones/<id>/` | Eliminar |

### 5.9 Alertas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alertas/` | Listar alertas |
| POST | `/api/alertas/crear/` | Crear alerta manual |
| POST | `/api/alertas/crear-automatica/` | Crear alerta automática |
| GET | `/api/alertas/no-leidas/` | Alertas no leídas |
| PATCH | `/api/alertas/marcar-leida/<id>/` | Marcar como leída |
| PATCH | `/api/alertas/marcar-atendida/<id>/` | Marcar como atendida |
| GET | `/api/alertas/<id>/` | Detalle |
| DELETE | `/api/alertas/<id>/` | Eliminar |

### 5.10 Configuración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/configuracion/umbrales/` | Listar reglas de umbral |
| POST | `/api/configuracion/umbrales/<id>/toggle/` | Activar/desactivar regla |
| GET | `/api/configuracion/sistema/` | Listar configuración |
| PUT | `/api/configuracion/sistema/<clave>/` | Actualizar parámetro |
| GET | `/api/configuracion/estadisticas/` | Estadísticas históricas |
| POST | `/api/configuracion/evaluar-reglas/` | Evaluar reglas inteligentes |
| GET | `/api/configuracion/reporte-alertas-pdf/` | Reporte PDF de alertas |
| GET | `/api/configuracion/reporte-alertas-excel/` | Reporte CSV de alertas |
| GET | `/api/configuracion/reporte-mediciones-csv/` | Reporte CSV de mediciones |
| GET | `/api/configuracion/reporte-sensores-csv/` | Reporte CSV de sensores |
| GET | `/api/configuracion/reporte-cultivos-csv/` | Reporte CSV de cultivos |
| POST | `/api/configuracion/backup/` | Generar backup |

---

## 6. CONFIGURACIÓN

### 6.1 Backend - Entornos

**Variables de entorno:**
- `DJANGO_SECRET_KEY`: Clave secreta (obligatoria en producción)
- `DJANGO_DEBUG`: `True` / `False`
- `DJANGO_FRONTEND_ORIGIN`: Origen del frontend para CORS
- `DJANGO_SECURE_SSL_REDIRECT`: `True` / `False`
- `ALLOWED_HOSTS`: Hosts permitidos separados por coma
- `DJANGO_SESSION_COOKIE_SECURE`: `True` / `False`
- `DJANGO_CSRF_COOKIE_SECURE`: `True` / `False`

### 6.2 Backend - CORS

```python
CORS_ALLOWED_ORIGINS = [
    os.environ.get('DJANGO_FRONTEND_ORIGIN', 'http://localhost:8081'),
    'http://localhost:19006',
    'http://localhost:3000',
]

CORS_ALLOW_HEADERS = [
    ...default_headers,
    'X-Usuario',
    'X-Password',
]
```

### 6.3 Backend - Manejo Global de Errores

`config/exception_handler.py` centraliza respuestas:
- 400: detalles de validación por campo
- 401: `No autenticado`
- 403: `No autorizado`
- 404: `Recurso no encontrado`
- 500: mensaje genérico + log interno

### 6.4 Frontend - Cliente API

**Archivo:** `services/api.ts`
- Base URL: `http://localhost:8000/api`
- Timeout: 15 segundos
- Headers: `X-Usuario`, `X-Password` desde storage
- Interceptor 401: limpia storage y redirige a login

**Archivo:** `lib/download.ts`
- Descarga de blobs PDF/CSV
- Crea enlace dinámico y dispara descarga

---

## 7. ROLES Y PERMISOS

### 7.1 Administrador
- Dashboard con KPIs completos
- Gestión de usuarios (CRUD + bloquear/desbloquear)
- Gestión de fincas, cultivos, sensores, alertas
- Generación de reportes PDF/Excel/CSV
- Configuración del sistema
- Acceso a monitoreo y logs

### 7.2 Agricultor
- Dashboard personalizado
- Mis fincas (asignadas por usuario)
- Mis cultivos
- Mis sensores
- Control de riego
- Estadísticas
- Alertas (activas e historial)
- Perfil propio

---

## 8. TECNOLOGÍAS

### 8.1 Frontend

| Tecnología | Versión |
|------------|---------|
| React Native | 0.81.5 |
| Expo | ~54.0.33 |
| TypeScript | 5.9.x |
| Expo Router | ~6.0.23 |
| Axios | 1.13.6 |
| React Native Web | ~0.21.0 |
| React Native Safe Area Context | ~5.6.0 |
| React Native Reanimated | ~4.1.1 |

### 8.2 Backend

| Tecnología | Versión |
|------------|---------|
| Django | 6.0.3 |
| Django REST Framework | 3.15+ |
| Python | 3.11+ |
| SQLite | 3 |
| django-cors-headers | 4.x |
| ReportLab | 4.x |

---

## 9. INSTALACIÓN Y DESPLIEGUE

### 9.1 Backend

```bash
cd backend_cultivos
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 9.2 Frontend

```bash
cd MiAppTareas
npm install
npx expo start
```

Web: `http://localhost:8081`  
Móvil: Expo Go  
Android: emulador con `adb reverse tcp:8000 tcp:8000`

### 9.3 Variables de entorno

Backend (.env o variables del sistema):
```
DJANGO_SECRET_KEY=tu-clave-secreta-aqui
DJANGO_DEBUG=False
DJANGO_FRONTEND_ORIGIN=https://tu-dominio.com
DJANGO_SECURE_SSL_REDIRECT=True
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
```

---

## 10. SEGURIDAD

### 10.1 Autenticación
- Headers personalizados `X-Usuario` y `X-Password`
- Contraseñas hasheadas con PBKDF2
- Sesión de Django para autenticación web

### 10.2 Autorización
- `AdminRequiredMixin`: restringe create/update/destroy a administradores
- `AdminOrOwnerRequiredMixin`: permite a propietarios editar sus recursos
- Validación por header en endpoints personalizados

### 10.3 Producción
- `DEBUG = False`
- `SECRET_KEY` desde variable de entorno
- `CORS_ALLOWED_ORIGINS` restringido
- `ALLOWED_HOSTS` configurado
- HTTPS obligatorio
- Base de datos PostgreSQL/MySQL

---

## 11. REPORTES

### 11.1 PDF
- Endpoint: `GET /api/configuracion/reporte-alertas-pdf/`
- Genera PDF con ReportLab
- Descarga directa en frontend como blob

### 11.2 Excel/CSV
- Endpoints:
  - `GET /api/configuracion/reporte-alertas-excel/`
  - `GET /api/configuracion/reporte-mediciones-csv/`
  - `GET /api/configuracion/reporte-sensores-csv/`
  - `GET /api/configuracion/reporte-cultivos-csv/`
- Genera CSV con encabezados
- Descarga directa en frontend

---

## 12. TAREAS DE MANTENIMIENTO

### 12.1 Migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 12.2 Verificación
```bash
python manage.py check
python manage.py check --deploy
```

### 12.3 Limpieza
- Eliminar archivos `test_*.py` y `init_users.py`
- Revisar logs de Django para errores 500
- Limpiar migraciones duplicadas en `alertas/migrations/`

---

## 13. GLOSARIO

| Término | Descripción |
|---------|-------------|
| API | Application Programming Interface |
| Backend | Servidor y lógica de negocio |
| CRUD | Create, Read, Update, Delete |
| DRF | Django REST Framework |
| Endpoint | URL específica de la API |
| ForeignKey | Relación de clave foránea en Django |
| REST | Representational State Transfer |
| ViewSet | Clase de DRF para operaciones CRUD |
| Serializador | Transformación entre modelos y JSON |
| Expo | Framework para desarrollo React Native |
| RC | Release Candidate |
| CORS | Cross-Origin Resource Sharing |
| Mixin | Clase reusable para agregar funcionalidad |
| Blob | Binary Large Object para archivos |

---

## 14. MEJORAS RC2

### 14.1 Backend
- Manejador global de excepciones
- Endurecimiento de settings para producción
- Eliminación de código muerto (LogAuditoria)
- Mejora de eliminación de usuarios con borrado seguro
- Reportes CSV adicionales (mediciones, sensores, cultivos)
- Mixin `AdminOrOwnerRequiredMixin` para permisos por propietario

### 14.2 Frontend
- Dashboards con KPIs y visualizaciones
- Componentes `BarChart` y `SensorStatus`
- Estados de carga, error y vacío
- Manejo global de 401
- Descarga real de PDF/CSV
- Navegación completa agricultor (fincas, riego, sensores)

---

© 2026 SIMC - Sistema Inteligente de Monitoreo de Cultivos
