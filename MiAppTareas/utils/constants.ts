export const ROLES = {
  ADMIN: 'administrador',
  FARMER: 'agricultor',
} as const;

export const API_BASE_URL = 'http://localhost:8000/api';

export const ROUTES = {
  ADMIN_DASHBOARD: '/(admin)/dashboard',
  AGRICULTOR_DASHBOARD: '/(agricultor)/dashboard',
  LOGIN: '/(auth)/login',
} as const;
