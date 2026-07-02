export interface Alerta {
  id_alerta: number;
  tipo_alerta: string;
  descripcion: string;
  fecha_alerta: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  leida: boolean;
}