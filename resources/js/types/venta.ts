export interface Venta {
  id: string;
  barberia_id: string;
  cliente_id: string;
  total: number;
  utilidad_neta: number | null;
  created_at: string;
  updated_at: string;
}
