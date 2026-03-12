export interface Venta {
  id: string;
  barberia_id: string;
  cita_id: string | null;
  cliente_id: string | null;
  barbero_id: string | null;
  tipo_origen: 'cita' | 'mostrador';
  estado: 'borrador' | 'pagada' | 'anulada' | string;
  subtotal: number;
  descuento: number;
  total: number;
  utilidad_neta: number | null;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  cliente?: {
    id: string;
    nombre: string;
    email: string | null;
  } | null;
  barbero?: {
    id: string;
    nombre: string;
  } | null;
  cita?: {
    id: string;
    inicio_at: string;
    estado: string;
  } | null;
}
