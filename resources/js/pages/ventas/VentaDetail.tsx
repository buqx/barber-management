import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Edit, Trash } from 'lucide-react';
import type { Venta } from '@/types/venta';

interface Props {
  venta: Venta;
}

export default function VentaDetail({ venta }: Props) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Venta: ${venta.id}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Receipt className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Venta #{venta.id}</h2>
        </div>
        <div className="text-neutral-300 mb-2">Cliente: {venta.clienteNombre}</div>
        <div className="text-neutral-400 mb-2">Total: ${venta.total}</div>
        <div className="text-neutral-400 mb-4">Fecha: {venta.fecha}</div>
        <div className="flex gap-2">
          <Button variant="default" className="bg-[#D4AF37] text-black font-semibold" asChild>
            <Link href={`/ventas/${venta.id}/edit`}><Edit className="mr-2" /> Editar</Link>
          </Button>
          <Button variant="destructive" className="bg-red-600 text-white font-semibold" asChild>
            <Link href={`/ventas/${venta.id}/delete`}><Trash className="mr-2" /> Eliminar</Link>
          </Button>
        </div>
      </Card>
      <Link href="/ventas" className="text-[#D4AF37] font-medium hover:underline">Volver a ventas</Link>
    </div>
  );
}
