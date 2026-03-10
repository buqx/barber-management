import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import type { Cita } from '@/types/cita';

interface Props {
  cita: Cita;
}

export default function CitaEdit({ cita }: Props) {
  const form = useForm({
    clienteId: cita.clienteId,
    barberoId: cita.barberoId,
    servicioId: cita.servicioId,
    fecha: cita.fecha,
    hora: cita.hora,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Editar Cita: ${cita.id}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Editar Cita #{cita.id}</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.put(`/citas/${cita.id}`);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="date"
            value={form.data.fecha}
            onChange={e => form.setData('fecha', e.target.value)}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="time"
            value={form.data.hora}
            onChange={e => form.setData('hora', e.target.value)}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          {/* Selects para cliente, barbero y servicio (mockup) */}
          <select
            value={form.data.clienteId}
            onChange={e => form.setData('clienteId', Number(e.target.value))}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          >
            <option value="">Selecciona cliente</option>
            {/* Opciones dinámicas */}
          </select>
          <select
            value={form.data.barberoId}
            onChange={e => form.setData('barberoId', Number(e.target.value))}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          >
            <option value="">Selecciona barbero</option>
            {/* Opciones dinámicas */}
          </select>
          <select
            value={form.data.servicioId}
            onChange={e => form.setData('servicioId', Number(e.target.value))}
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          >
            <option value="">Selecciona servicio</option>
            {/* Opciones dinámicas */}
          </select>
          <Button
            type="submit"
            variant="default"
            className="bg-[#D4AF37] text-black font-semibold"
          >Guardar cambios</Button>
        </form>
      </Card>
      <Link href={`/citas/${cita.id}`} className="text-[#D4AF37] font-medium hover:underline">Volver al detalle</Link>
    </div>
  );
}
