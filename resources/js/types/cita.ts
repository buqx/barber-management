export interface Cita {
  id: string;
  barberia_id: string;
  barbero_id: string;
  cliente_id: string;
  inicio_at: string;
  fin_at: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  total_pagado: number | null;
  created_at: string;
  updated_at: string;
}
