import api from './api';

export interface Cultivo {
  id_cultivo: number;
  nombre_cultivo: string;
  tipo_cultivo: string;
  ubicacion: string;
  tamaño_area: number;
  fecha_siembra: string;
  estado: string;
  imagen?: string;
  id_finca: number;
}

export const cultivosService = {
  list: () => api.get<Cultivo[]>('/cultivos/'),
  get: (id: number) => api.get<Cultivo>(`/cultivos/${id}/`),
  create: (data: Partial<Cultivo>) => api.post('/cultivos/', data),
  update: (id: number, data: Partial<Cultivo>) => api.put(`/cultivos/${id}/`, data),
  delete: (id: number) => api.delete(`/cultivos/${id}/`),
};