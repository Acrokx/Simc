import api from './api';

export interface Alerta {
  id_alerta: number;
  tipo_alerta: string;
  descripcion: string;
  fecha_alerta: string;
  prioridad: string;
  leida: boolean;
}

export const alertasService = {
  list: (leida?: boolean) => api.get<Alerta[]>(`/alertas/${leida !== undefined ? `?leida=${leida}` : ''}`),
  get: (id: number) => api.get<Alerta>(`/alertas/${id}/`),
  markAsRead: (id: number) => api.patch(`/alertas/${id}/`, { leida: true }),
};

export interface Medicion {
  id_medicion: number;
  valor_humedad: number;
  fecha_medicion: string;
  id_sensor: number;
}

export const medicionesService = {
  list: (id_sensor?: number) => api.get<Medicion[]>(id_sensor ? `/mediciones/?id_sensor=${id_sensor}` : '/mediciones/'),
  create: (data: { id_sensor: number; valor_humedad: number }) => api.post('/mediciones/crear/', data),
  simular: () => api.post('/mediciones/simular/'),
};