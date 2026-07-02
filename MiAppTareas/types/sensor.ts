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