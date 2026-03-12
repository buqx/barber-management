export interface VentaDetalle {
  id: string;
  venta_id: string;
  tipo_item: 'servicio' | 'producto';
  servicio_id: string | null;
  producto_id: string | null;
  descripcion: string | null;
  cantidad: number;
  precio_venta: number;
  precio_costo: number;
  subtotal: number;
  utilidad_neta: number;
  servicio?: {
    id: string;
    nombre: string;
    precio: number;
  } | null;
  producto?: {
    id: string;
    nombre: string;
    precio_venta: number;
  } | null;
}
