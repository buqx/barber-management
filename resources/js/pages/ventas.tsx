import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus } from 'lucide-react';
import type { Venta } from '@/types/venta';
import { useForm } from '@inertiajs/react';

interface Props {
  ventas: Venta[];
}

export default function Ventas({ ventas }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    cliente_id: '',
    total: 0,
    fecha: '',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Ventas" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <DollarSign className="text-[#D4AF37]" /> Ventas
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/ventas')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Registrar Venta
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ventas.map((venta) => (
          <Card key={venta.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <Badge className="bg-[#D4AF37] text-black font-semibold">Venta #{venta.id}</Badge>
              <div className="text-sm text-neutral-300">Cliente: {venta.clienteNombre}</div>
              <div className="text-xs text-neutral-400">Total: ${venta.total}</div>
              <div className="text-xs text-neutral-400">Fecha: {venta.fecha}</div>
              <Link
                href={`/ventas/${venta.id}`}
                className="mt-2 text-[#D4AF37] font-medium hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
