import api from './api';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  rol: string;
  bloqueado?: boolean;
}

export const usuariosService = {
  list: () => api.get<Usuario[]>('/usuarios/'),
  getAgricultores: () => api.get<Usuario[]>('/usuarios/agricultores/'),
  get: (id: number) => api.get<Usuario>(`/usuarios/${id}/`),
  create: (data: Partial<Usuario>) => api.post('/usuarios/', data),
  update: (id: number, data: Partial<Usuario>) => api.put(`/usuarios/editar/${id}/`, data),
  delete: (id: number) => api.delete(`/usuarios/eliminar/${id}/`),
  toggleBloqueo: (id: number) => api.post(`/usuarios/${id}/bloquear/`),
  changeRole: (id: number, rol: string) => api.patch(`/usuarios/editar/${id}/`, { rol }),
};