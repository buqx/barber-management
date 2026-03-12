export interface Barbero {
  id: string;
  barberia_id: string;
  nombre: string;
  email: string | null;
  es_dueno: boolean;
  comision_porcentaje: number | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
