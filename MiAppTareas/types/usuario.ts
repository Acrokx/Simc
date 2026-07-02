export interface StoredUser {
  rol?: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  [key: string]: any;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  rol: 'Administrador' | 'Agricultor';
  password?: string;
  bloqueado?: boolean;
}