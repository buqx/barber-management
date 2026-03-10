import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';
import type { Barberia } from '@/types/barberia';

interface Props {
  barberia: Barberia;
}

export default function BarberiaEdit({ barberia }: Props) {
  const form = useForm({
    nombre: barberia.nombre,
    direccion: barberia.direccion,
    telefono: barberia.telefono,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Editar Barbería: ${barberia.nombre}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Store className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Editar {barberia.nombre}</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.put(`/barberias/${barberia.id}`);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            value={form.data.nombre}
            onChange={e => form.setData('nombre', e.target.value)}
            placeholder="Nombre"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="text"
            value={form.data.direccion}
            onChange={e => form.setData('direccion', e.target.value)}
            placeholder="Dirección"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="text"
            value={form.data.telefono}
            onChange={e => form.setData('telefono', e.target.value)}
            placeholder="Teléfono"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <Button
            type="submit"
            variant="default"
            className="bg-[#D4AF37] text-black font-semibold"
          >Guardar cambios</Button>
        </form>
      </Card>
      <Link href={`/barberias/${barberia.id}`} className="text-[#D4AF37] font-medium hover:underline">Volver al detalle</Link>
    </div>
  );
}
