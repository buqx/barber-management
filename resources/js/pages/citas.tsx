import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import type { Cita } from '@/types/cita';
import { useForm } from '@inertiajs/react';

interface Props {
  citas: Cita[];
}

export default function Citas({ citas }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    cliente_id: '',
    barbero_id: '',
    servicio_id: '',
    fecha: '',
    hora: '',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Citas" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <Calendar className="text-[#D4AF37]" /> Citas
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/citas')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Agendar Cita
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {citas.map((cita) => (
          <Card key={cita.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <Badge className="bg-[#D4AF37] text-black font-semibold">{cita.fecha} {cita.hora}</Badge>
              <div className="text-sm text-neutral-300">Cliente: {cita.clienteNombre}</div>
              <div className="text-xs text-neutral-400">Barbero: {cita.barberoNombre}</div>
              <div className="text-xs text-neutral-400">Servicio: {cita.servicioNombre}</div>
              <Link
                href={`/citas/${cita.id}`}
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
