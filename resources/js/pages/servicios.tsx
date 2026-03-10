import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scissors, Plus } from 'lucide-react';
import type { Servicio } from '@/types/servicio';
import { useForm } from '@inertiajs/react';

interface Props {
  servicios: Servicio[];
}

export default function Servicios({ servicios }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    nombre: '',
    precio: 0,
    duracion: '',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Servicios" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <Scissors className="text-[#D4AF37]" /> Servicios
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/servicios')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Agregar Servicio
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servicios.map((servicio) => (
          <Card key={servicio.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <Badge className="bg-[#D4AF37] text-black font-semibold">{servicio.nombre}</Badge>
              <div className="text-sm text-neutral-300">Duración: {servicio.duracion}</div>
              <div className="text-xs text-neutral-400">Precio: ${servicio.precio}</div>
              <Link
                href={`/servicios/${servicio.id}`}
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
