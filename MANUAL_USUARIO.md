# MANUAL DE USUARIO - SIMC

## Sistema Inteligente de Monitoreo de Cultivos

**Versión:** 2.0 RC  
**Fecha:** Julio 2026  
**Proyecto:** SIMC

---

## 1. INTRODUCCIÓN

### 1.1 Acerca de SIMC

SIMC es una aplicación web y móvil diseñada para que agricultores y administradores gestionen fincas, cultivos, sensores de monitoreo, alertas, riego y estadísticas en tiempo real, permitiendo un mejor manejo de los recursos hídricos y la toma de decisiones.

### 1.2 Requisitos del Sistema

**Para navegador web:**
- Chrome 90+ / Firefox 88+ / Edge 90+

**Para móvil:**
- Android 6.0+ o iOS 13+
- Expo Go instalado

**Servidor backend:**
- Python 3.11+
- Django 6.0.3

---

## 2. INICIO DE SESIÓN

### 2.1 Acceso a la Aplicación

1. Abre la aplicación en tu navegador o dispositivo móvil
2. Ingresa tu **correo electrónico**
3. Ingresa tu **contraseña**
4. Presiona **"Iniciar sesión"**

### 2.2 Credenciales de Acceso

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@simc.com | admin123 | Administrador |
| juan@simc.com | juan123456 | Agricultor |
| maria@simc.com | maria123456 | Agricultor |

### 2.3 Recuperar Contraseña

Si olvidas tu contraseña, contacta al administrador del sistema para que te asigne una nueva.

---

## 3. NAVEGACIÓN

### 3.1 Administrador

| Icono | Función |
|-------|---------|
| 🏠 Inicio | Dashboard administrativo |
| 🌱 Cultivos | Gestión de cultivos |
| 📡 Sensores | Gestión de sensores |
| 🚨 Alertas | Gestión de alertas |
| 👤 Perfil | Perfil y cerrar sesión |

Accesos adicionales:
- ☁️ **Configuración**: parámetros, alertas, API, correos, monitoreo, backups, IA
- 📝 **Reportes**: PDF, Excel/CSV

### 3.2 Agricultor

| Icono | Función |
|-------|---------|
| 🏠 Inicio | Dashboard agrícola |
| 🏡 Fincas | Mis fincas asignadas |
| 🌱 Cultivos | Mis cultivos |
| 📡 Sensores | Mis sensores |
| 💧 Riego | Control de riego |
| 📊 Estadísticas | Indicadores y gráficas |
| 🚨 Alertas | Alertas activas e historial |
| 👤 Perfil | Perfil y cerrar sesión |

---

## 4. DASHBOARD

### 4.1 Dashboard Administrador

Muestra:
- **KPIs principales**: usuarios, fincas, cultivos, sensores, alertas activas, alertas críticas, mediciones, humedad promedio
- **Acciones rápidas**: crear finca, cultivo, sensor, agricultor, configuración
- **Alertas recientes**: últimas alertas del sistema

### 4.2 Dashboard Agricultor

Muestra:
- **Sensores en tiempo real**: humedad, temperatura, nivel de agua
- **Resumen**: fincas, cultivos, sensores, alertas
- **Estado de sensores**: indicador visual activos/inactivos
- **Tendencia de humedad**: gráfico de barras
- **Alertas recientes**
- **Recomendaciones**

---

## 5. GESTIÓN DE FINCAS

### 5.1 Ver Fincas (Administrador)

1. Navega a **Fincas** en el menú lateral
2. Visualiza todas las fincas con:
   - Nombre
   - Ubicación
   - Tamaño en hectáreas
   - Estado

### 5.2 Mis Fincas (Agricultor)

1. Navega a **Fincas** en el menú inferior
2. Visualiza únicamente las fincas asignadas a tu usuario
3. Toca **"Ver cultivos y sensores"** para expandir:
   - Cultivos asociados
   - Sensores instalados

### 5.3 Detalle de Finca

1. Toca una finca para ver su detalle
2. Información disponible:
   - Nombre, ubicación, área, estado
   - Cultivos asociados (nombre, tipo, estado, fecha de siembra)
   - Sensores instalados (código, tipo, ubicación, estado)

---

## 6. GESTIÓN DE CULTIVOS

### 6.1 Ver Cultivos

1. Navega a **Cultivos**
2. Visualiza todos los cultivos con:
   - Nombre y tipo
   - Estado
   - Finca asociada

### 6.2 Registrar Nuevo Cultivo (Administrador)

1. Toca **"+ Nuevo Cultivo"**
2. Completa:
   - Nombre del cultivo
   - Tipo de cultivo
   - Área (m²)
   - Finca asociada (selector)
3. Presiona **"Crear Cultivo"**

### 6.3 Mis Cultivos (Agricultor)

1. Navega a **Cultivos** en el menú inferior
2. Visualiza tus cultivos
3. Toca un cultivo para ver:
   - Información general
   - Historial de crecimiento y monitoreo
   - Sensores asociados

---

## 7. GESTIÓN DE SENSORES

### 7.1 Ver Sensores

1. Navega a **Sensores**
2. Visualiza la lista con:
   - Código o tipo de sensor
   - Ubicación
   - Estado

### 7.2 Detalle de Sensor (Agricultor)

1. Toca un sensor para ver:
   - Información general
   - **Última lectura**: humedad registrada
   - **Historial reciente**: últimas 10 mediciones

### 7.3 Crear Sensor (Administrador)

1. Toca **"Crear Sensor"**
2. Completa:
   - Código (opcional)
   - Tipo de sensor
   - Ubicación
   - Cultivo asociado (selector)
3. Presiona **"Crear Sensor"**

---

## 8. MEDICIONES

### 8.1 Ver Mediciones

1. Navega a **Mediciones** (administrador)
2. Visualiza el historial de mediciones de humedad
3. Información mostrada:
   - Valor de humedad (%)
   - Sensor que generó la medición
   - Fecha y hora

### 8.2 Simular Mediciones

1. En la pantalla de Mediciones, toca **"⚡ Simular Mediciones"**
2. El sistema genera registros aleatorios de humedad (15% - 90%)
3. Se generan alertas automáticas cuando la humedad está fuera del rango (30% - 70%)

---

## 9. ALERTAS

### 9.1 Tipos de Alertas

- 🟢 **Info**: humedad baja/alta dentro de rango moderado
- 🟡 **Advertencia**: condiciones que requieren atención
- 🔴 **Crítica**: humedad baja (< 30%) o alta (> 70%), temperatura elevada, sensor desconectado

### 9.2 Ver Alertas (Agricultor)

1. Navega a **Alertas**
2. Usa las pestañas **Activas** / **Historial**
3. Toca una alerta para marcarla como revisada

### 9.3 Ver Alertas (Administrador)

1. Navega a **Alertas**
2. Filtra por activas o historial
3. Marca alertas como leídas o atendidas

---

## 10. CONTROL DE RIEGO

### 10.1 Activar Riego

1. Navega a **Riego**
2. Toca **"Activar riego"**
3. El sistema registra:
   - Fecha y hora de inicio
   - Cantidad de agua (L)

### 10.2 Detener Riego

1. Toca **"Detener riego"**
2. El sistema actualiza el registro con:
   - Hora de finalización
   - Cantidad final

### 10.3 Historial

Visualiza todos los riegos realizados con:
- Fecha
- Cultivo
- Cantidad de agua
- Estado

---

## 11. ESTADÍSTICAS

### 11.1 Indicadores

Visualiza:
- **Humedad prom.**: promedio de humedad del suelo
- **Temperatura**: promedio de temperatura
- **Sensores activos**: cantidad y porcentaje

### 11.2 Gráficas

- **Humedad últimos días**: gráfico de barras de los últimos 7 días
- **Tendencias**: comportamiento del cultivo

### 11.3 Recomendaciones

El sistema muestra recomendaciones basadas en los datos:
- "Los niveles de humedad se mantienen estables..."
- "Se recomienda verificar los sensores..."

---

## 12. REPORTES

### 12.1 Generar Reporte PDF (Administrador)

1. Navega a **Reportes** → **Exportar PDF**
2. Toca **"Generar Reporte PDF"**
3. El archivo `reporte_alertas.pdf` se descargará automáticamente

### 12.2 Generar Reporte Excel/CSV (Administrador)

1. Navega a **Reportes** → **Exportar Excel**
2. Toca **"Generar Reporte Excel"**
3. El archivo `reporte_alertas.csv` se descargará automáticamente

### 12.3 Exportar Datos (Administrador)

Desde **Configuración** → **Copias de Seguridad**:
- Exportar alertas (CSV)
- Exportar mediciones (CSV)
- Exportar sensores (CSV)
- Exportar cultivos (CSV)

---

## 13. PERFIL DE USUARIO

### 13.1 Editar Perfil

1. Navega a **Perfil**
2. Toca **"Editar"**
3. Modifica:
   - Nombre
   - Apellido
   - Teléfono
4. Presiona **"Guardar"**

### 13.2 Cerrar Sesión

1. Toca **"Cerrar sesión"** en la pantalla de perfil
2. Serás redirigido a la pantalla de inicio de sesión

---

## 14. CONFIGURACIÓN (ADMINISTRADOR)

### 14.1 Parámetros Generales

1. Navega a **Configuración** → **Parámetros Generales**
2. Visualiza variables del sistema
3. Toca **"Editar"** para modificar un valor
4. Presiona **"Guardar"**

### 14.2 Configuración de Alertas

1. Navega a **Configuración** → **Configuración de Alertas**
2. Visualiza reglas de umbral
3. Toca **"Activar/Desactivar"** para habilitar o deshabilitar una regla

### 14.3 Configuración de API

1. Navega a **Configuración** → **Configuración de API**
2. Visualiza logs de acceso a la API
3. Toca **"Actualizar"** para refrescar

### 14.4 Configuración de Correos

1. Navega a **Configuración** → **Correos Electrónicos**
2. Configura:
   - Servidor SMTP
   - Puerto
   - Usuario SMTP
   - Contraseña SMTP
   - Correo remitente
3. Presiona **"Guardar Configuración"**

### 14.5 Monitoreo

1. Navega a **Configuración** → **Monitoreo**
2. Visualiza:
   - **Estadísticas**: alertas, mediciones, usuarios, fincas, cultivos, sensores
   - **Logs**: registros de actividad del sistema

### 14.6 Backups

1. Navega a **Configuración** → **Copias de Seguridad**
2. Toca **"Generar Backup"**
3. Exporta datos en CSV:
   - Alertas
   - Mediciones
   - Sensores
   - Cultivos

---

## 15. SOLUCIÓN DE PROBLEMAS

### 15.1 No puedo iniciar sesión

- Verifica que el correo electrónico sea correcto
- Verifica que la contraseña sea correcta
- Asegúrate de que el servidor backend esté funcionando en el puerto 8000

### 15.2 No veo datos en la app

- Verifica que existan registros en la base de datos
- Usa las credenciales de administrador para crear datos de prueba
- Revisa la consola del navegador para errores

### 15.3 No puedo crear un cultivo/sensor

- Asegúrate de tener fincas/cultivos registrados previamente
- Verifica que los campos obligatorios estén completos
- Revisa que no haya errores de validación en el formulario

---

## 16. CONTACTO Y SOPORTE

- **Aplicación:** SIMC - Sistema Inteligente de Monitoreo de Cultivos
- **Tecnología:** React Native + Expo + Django REST Framework
- **Base de datos:** SQLite / PostgreSQL
- **Reportes:** PDF (ReportLab), CSV nativo

---

© 2026 SIMC - Sistema Inteligente de Monitoreo de Cultivos
