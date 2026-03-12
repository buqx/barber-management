export interface HorarioBase {
  id: string;
  barbero_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  almuerzo_inicio: string | null;
  almuerzo_fin: string | null;
  created_at: string;
  updated_at: string;
}
