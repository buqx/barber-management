export interface Cliente {
  id: string;
  barberia_id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}
