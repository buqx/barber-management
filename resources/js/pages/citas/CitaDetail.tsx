import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash } from 'lucide-react';
import type { Cita } from '@/types/cita';

interface Props {
  cita: Cita;
}

export default function CitaDetail({ cita }: Props) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Cita: ${cita.id}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Cita #{cita.id}</h2>
        </div>
        <div className="text-neutral-300 mb-2">Cliente: {cita.clienteNombre}</div>
        <div className="text-neutral-400 mb-2">Barbero: {cita.barberoNombre}</div>
        <div className="text-neutral-400 mb-2">Servicio: {cita.servicioNombre}</div>
        <div className="text-neutral-400 mb-4">Fecha: {cita.fecha} - Hora: {cita.hora}</div>
        <div className="flex gap-2">
          <Button variant="default" className="bg-[#D4AF37] text-black font-semibold" asChild>
            <Link href={`/citas/${cita.id}/edit`}><Edit className="mr-2" /> Editar</Link>
          </Button>
          <Button variant="destructive" className="bg-red-600 text-white font-semibold" asChild>
            <Link href={`/citas/${cita.id}/delete`}><Trash className="mr-2" /> Eliminar</Link>
          </Button>
        </div>
      </Card>
      <Link href="/citas" className="text-[#D4AF37] font-medium hover:underline">Volver a citas</Link>
    </div>
  );
}
