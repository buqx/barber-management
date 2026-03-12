export interface VentaDetalle {
  id: string;
  venta_id: string;
  servicio_id: string;
  precio_venta: number;
  precio_costo: number;
  utilidad_neta: number;
  servicio?: {
    id: string;
    nombre: string;
    precio: number;
  } | null;
}
