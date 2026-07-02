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