import axios from 'axios';
import { getItem } from '../lib/storage';

const API_PORT = 8000;
const API_BASE_URL = `http://localhost:${API_PORT}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const userDataStr = await getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const correo = userData.correo || userData.email || userData.username;
        const password = userData.password || userData.contraseña || userData.pwd || userData.pass;
        if (correo) config.headers['X-Usuario'] = correo;
        if (password) config.headers['X-Password'] = password;
      }
    } catch (e) {
      console.warn('Could not get/parse userData from storage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Timeout de conexión'));
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    if (status === 401) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

function handleUnauthorized() {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname || '';
  if (path.startsWith('/(auth)')) return;
  try {
    localStorage.removeItem('userData');
  } catch {}
  const target = '/(auth)/login';
  if (path !== target && path !== target + '/') {
    window.location.href = target;
  }
}

export function setAuthHeaders(userData: { correo: string; password: string }) {
  if (!userData) return;
  const correo = (userData as any).correo || (userData as any).email || (userData as any).username;
  const password = (userData as any).password || (userData as any).contraseña || (userData as any).pwd || (userData as any).pass;
  if (correo) api.defaults.headers.common['X-Usuario'] = correo;
  if (password) api.defaults.headers.common['X-Password'] = password;
}

export default api;
