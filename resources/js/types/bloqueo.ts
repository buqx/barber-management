export interface BloqueoExcepcion {
  id: string;
  barbero_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  todo_el_dia: boolean;
  created_at: string;
  updated_at: string;
}
