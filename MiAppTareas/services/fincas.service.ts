import api from './api';

export interface Finca {
  id_finca: number;
  nombre_finca: string;
  ubicacion: string;
  tamaño_hectareas: number;
  tipo_cultivo?: string;
  estado?: string;
  descripcion?: string;
  imagen?: string;
}

export const fincasService = {
  list: () => api.get<Finca[]>('/fincas/'),
  get: (id: number) => api.get<Finca>(`/fincas/${id}/`),
  create: (data: Partial<Finca>) => api.post('/fincas/', data),
  update: (id: number, data: Partial<Finca>) => api.put(`/fincas/${id}/`, data),
  delete: (id: number) => api.delete(`/fincas/${id}/`),
};