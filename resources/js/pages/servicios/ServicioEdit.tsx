import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';
import type { Servicio } from '@/types/servicio';

interface Props {
  servicio: Servicio;
}

export default function ServicioEdit({ servicio }: Props) {
  const form = useForm({
    nombre: servicio.nombre,
    duracion: servicio.duracion,
    precio: servicio.precio,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Editar Servicio: ${servicio.nombre}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Scissors className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Editar {servicio.nombre}</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.put(`/servicios/${servicio.id}`);
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
            type="number"
            value={form.data.duracion}
            onChange={e => form.setData('duracion', Number(e.target.value))}
            placeholder="Duración (min)"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="number"
            value={form.data.precio}
            onChange={e => form.setData('precio', Number(e.target.value))}
            placeholder="Precio"
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
      <Link href={`/servicios/${servicio.id}`} className="text-[#D4AF37] font-medium hover:underline">Volver al detalle</Link>
    </div>
  );
}
