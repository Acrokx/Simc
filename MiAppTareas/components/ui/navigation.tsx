export const ADMIN_BOTTOM_NAV = [
  { icon: "🏠", label: "Inicio", route: "/(admin)/dashboard" },
  { icon: "🌱", label: "Cultivos", route: "/(admin)/cultivos" },
  { icon: "📡", label: "Sensores", route: "/(admin)/sensores" },
  { icon: "🚨", label: "Alertas", route: "/(admin)/alertas" },
  { icon: "👤", label: "Perfil", route: "/(admin)/perfil" },
] as const;

export const AGRICULTOR_BOTTOM_NAV = [
  { icon: "🏠", label: "Inicio", route: "/(agricultor)/dashboard" },
  { icon: "🌱", label: "Cultivos", route: "/(agricultor)/mis-cultivos" },
  { icon: "📊", label: "Estadísticas", route: "/(agricultor)/estadisticas" },
  { icon: "🚨", label: "Alertas", route: "/(agricultor)/alertas" },
  { icon: "👤", label: "Perfil", route: "/(agricultor)/perfil" },
] as const;

export const ADMIN_EXTRA_ROUTES = [
  { icon: "☁️", title: "Config. Sistema", route: "/(admin)/configuracion/sistema" },
  { icon: "⚙️", title: "Parámetros Generales", route: "/(admin)/configuracion/general" },
  { icon: "🚨", title: "Config. Alertas", route: "/(admin)/configuracion/alertas" },
  { icon: "📡", title: "Config. API y Logs", route: "/(admin)/configuracion/api" },
  { icon: "📧", title: "Correos Electrónicos", route: "/(admin)/configuracion/correos" },
  { icon: "📊", title: "Monitoreo", route: "/(admin)/configuracion/monitoreo" },
  { icon: "💾", title: "Copias de Seguridad", route: "/(admin)/configuracion/backups" },
  { icon: "🧠", title: "Configuración IA", route: "/(admin)/configuracion/inteligente" },
  { icon: "📝", title: "Reportes", route: "/(admin)/reportes" },
  { icon: "👤", title: "Perfil", route: "/(admin)/perfil" },
];