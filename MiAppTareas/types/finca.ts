export interface Finca {
  id_finca: number;
  nombre_finca: string;
  ubicacion: string;
  tamaño_hectareas: number;
  tipo_cultivo?: string;
  estado?: 'activa' | 'inactiva';
  descripcion?: string;
  imagen?: string;
  id_usuario?: number;
}