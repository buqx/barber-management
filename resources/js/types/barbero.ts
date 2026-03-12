export interface Barbero {
  id: string;
  barberia_id: string;
  user_id: number | null;
  nombre: string;
  email: string | null;
  cedula: string | null;
  foto_path: string | null;
  foto_url: string | null;
  es_dueno: boolean;
  comision_porcentaje: number | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
