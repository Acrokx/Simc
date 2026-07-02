import api from '../services/api';

export interface Reporte {
  id_reporte: number;
  tipo: string;
  fecha: string;
  usuario: string;
}

export const reportesService = {
  list: () => api.get<Reporte[]>('/configuracion/reporte-alertas/'),
  pdf: () => api.get('/configuracion/reporte-alertas-pdf/'),
  excel: () => api.get('/configuracion/reporte-alertas-excel/'),
};
