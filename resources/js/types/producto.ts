export interface Producto {
  id: string;
  nombre: string;
  stock_actual: number;
  precio_costo: number | null;
  precio_venta: number;
  created_at: string;
  updated_at: string;
}
