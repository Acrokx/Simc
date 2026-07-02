import api from './api';

export interface Sensor {
  id_sensor: number;
  codigo_sensor?: string;
  tipo_sensor: string;
  ubicacion: string;
  estado: string;
  id_cultivo: number;
  frecuencia_minutos?: number;
  rango_min?: number;
  rango_max?: number;
  activo?: boolean;
}

export const sensoresService = {
  list: () => api.get<Sensor[]>('/sensores/'),
  get: (id: number) => api.get<Sensor>(`/sensores/${id}/`),
  create: (data: Partial<Sensor>) => api.post('/sensores/', data),
  update: (id: number, data: Partial<Sensor>) => api.put(`/sensores/${id}/`, data),
  delete: (id: number) => api.delete(`/sensores/${id}/`),
};