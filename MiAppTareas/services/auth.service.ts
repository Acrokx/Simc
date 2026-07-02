import api from './api';
import { getItem, setItem } from '../lib/storage';

export interface LoginResponse {
  success: boolean;
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
  message?: string;
}

export async function login(correo: string, contraseña: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/login/', { correo, contraseña });
  if (response.data?.success && response.data.usuario) {
    await setItem('userData', JSON.stringify(response.data.usuario));
  }
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/logout/');
  await setItem('userData', '');
}

export async function getCurrentUser() {
  const userStr = await getItem('userData');
  if (!userStr) return null;
  return JSON.parse(userStr);
}