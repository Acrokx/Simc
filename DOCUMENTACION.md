# Documentación del Proyecto SIMC

## Portada

**SIMC - Sistema Inteligente de Monitoreo de Cultivos**  
Versión: 2.0.0  
Fecha: Julio 2026  
Autor: Cristhian Enciso

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Características del Software](#características-del-software)
4. [Presentación del proyecto](#presentación-del-proyecto)
5. [Justificación](#justificación)
6. [Objetivo General](#objetivo-general)
7. [Objetivos Específicos](#objetivos-específicos)
8. [Alcance del Proyecto](#alcance-del-proyecto)
9. [Descripción](#descripción)
10. [Limitaciones](#limitaciones)
11. [Metodología](#metodología)

---

## Resumen Ejecutivo

SIMC es una aplicación móvil desarrollada en React Native con Expo que permite el monitoreo inteligente de cultivos mediante sensores IoT. El sistema incluye un backend en Django REST Framework que gestiona usuarios, fincas, cultivos, sensores y alertas. La aplicación proporciona una interfaz intuitiva para visualizar datos de sensores, recibir notificaciones de alertas y gestionar configuraciones de cultivo.

---

## Descripción del Proyecto

SIMC (Sistema Inteligente de Monitoreo de Cultivos) es una solución integral para la agricultura tecnológica que integra:

- **Frontend móvil**: Aplicación desarrollada en React Native con Expo, utilizando NativeWind para estilos y navegación basada en archivos.
- **Backend API**: Servidor Django REST Framework con gestión de usuarios, fincas, cultivos, sensores y mediciones.
- **Sensores IoT**: Integración con dispositivos de monitoreo de humedad, temperatura y otros parámetros agrícolas.

La arquitectura sigue un patrón cliente-servidor con comunicación vía API REST, permitiendo escalabilidad y mantenibilidad del sistema.

---

## Características del Software

### Aplicación Móvil (MiAppTareas)
- Gestión de autenticación de usuarios
- Visualización de dashboard con métricas en tiempo real
- Gestión de fincas y cultivos
- Monitoreo de sensores (humedad, temperatura)
- Notificaciones de alertas
- Navegación intuitiva con pestañas

### Backend (Django)
- API RESTful con endpoints para usuarios, fincas, cultivos, sensores y mediciones
- Autenticación basada en tokens
- Serializadores para validación de datos
- Panel administrativo de Django
- Migraciones de base de datos

---

## Presentación del proyecto

SIMC es una aplicación móvil diseñada para agricultores y técnicos agrícolas que necesitan monitorear en tiempo real las condiciones de sus cultivos. La aplicación permite:

- Registrar y gestionar múltiples fincas
- Configurar cultivos con tipo y tamaño de área
- Visualizar lecturas de sensores IoT
- Recibir alertas sobre condiciones críticas
- Acceder a reportes de monitoreo

La interfaz está desarrollada con React Native y NativeWind, ofreciendo una experiencia nativa en dispositivos móviles.

---

## Justificación

El desarrollo de SIMC responde a la necesidad creciente de digitalizar la agricultura mediante el uso de tecnologías IoT. Este sistema permite:

- Optimizar el uso de recursos hídricos y fertilizantes
- Detectar problemas en los cultivos de manera temprana
- Facilitar la toma de decisiones basada en datos reales
- Mejorar la productividad agrícola mediante monitoreo continuo

---

## Objetivo General

Desarrollar un sistema móvil integral para el monitoreo inteligente de cultivos que integre sensores IoT con una interfaz amigable, proporcionando a los agricultores herramientas para la gestión eficiente de sus cultivos.

---

## Objetivos Específicos

- Implementar una API REST en Django para la gestión de datos agrícolas
- Desarrollar una aplicación móvil con interfaz intuitiva usando React Native
- Integrar sensores de humedad y temperatura mediante comunicación HTTP
- Implementar un sistema de alertas para condiciones críticas
- Diseñar un dashboard con visualización de métricas en tiempo real
- Garantizar la seguridad de la autenticación de usuarios

---

## Alcance del Proyecto

### Descripción

El proyecto abarca el desarrollo completo de:

- Aplicación móvil para Android/iOS
- Backend API con Django REST Framework
- Sistema de gestión de usuarios y permisos
- Módulo de monitoreo de sensores
- Sistema de notificaciones y alertas

### Limitaciones

- Requiere conexión a internet para sincronizar datos
- Dependiente de hardware de sensores compatibles
- Limitado a los parámetros de los sensores configurados
- No incluye procesamiento de imágenes satelitales
- La API está configurada para red local (192.168.1.11)

---

## Metodología

Se utiliza una metodología ágil con ciclos de desarrollo iterativo:

1. **Análisis de requerimientos**: Identificación de necesidades del usuario agrícola
2. **Diseño del sistema**: Arquitectura cliente-servidor y modelado de datos
3. **Desarrollo del backend**: API REST con Django y endpoints funcionales
4. **Desarrollo del frontend**: Interfaz móvil con React Native y navegación
5. **Integración**: Conexión entre frontend y backend mediante Axios
6. **Pruebas**: Validación de funcionalidades y corrección de bugs
7. **Despliegue**: Configuración para producción y distribución

El proyecto está estructurado en dos componentes principales:
- `MiAppTareas/`: Aplicación móvil (React Native/Expo)
- `backend_cultivos/`: API Django REST Framework