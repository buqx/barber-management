import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import type { Venta } from '@/types/venta';

interface Props {
  venta: Venta;
}

export default function VentaEdit({ venta }: Props) {
  const form = useForm({
    clienteId: venta.clienteId,
    total: venta.total,
    fecha: venta.fecha,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Editar Venta: ${venta.id}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Receipt className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Editar Venta #{venta.id}</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.put(`/ventas/${venta.id}`);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="number"
            value={form.data.total}
            onChange={e => form.setData('total', Number(e.target.value))}
            placeholder="Total"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="date"
            value={form.data.fecha}
            onChange={e => form.setData('fecha', e.target.value)}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          {/* Select para cliente (mockup) */}
          <select
            value={form.data.clienteId}
            onChange={e => form.setData('clienteId', Number(e.target.value))}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          >
            <option value="">Selecciona cliente</option>
            {/* Opciones dinámicas */}
          </select>
          <Button
            type="submit"
            variant="default"
            className="bg-[#D4AF37] text-black font-semibold"
          >Guardar cambios</Button>
        </form>
      </Card>
      <Link href={`/ventas/${venta.id}`} className="text-[#D4AF37] font-medium hover:underline">Volver al detalle</Link>
    </div>
  );
}
