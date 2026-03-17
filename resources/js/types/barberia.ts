export interface Barberia {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  color_primario: string;
  color_secundario: string;
  banner_url: string | null;
  descripcion: string | null;
  telefono: string | null;
  direccion: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  horario_atencion: string | null;
  moneda: string;
  timezone: string;
  booking_habilitado: boolean;
  dias_anticipacion: number;
  intervalo_citas: number;
  created_at: string;
  updated_at: string;
}
