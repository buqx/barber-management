import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Building } from 'lucide-react';
import type { Barberia } from '@/types/barberia';
import { useForm } from '@inertiajs/react';

interface Props {
  barberias: Barberia[];
}

export default function Barberias({ barberias }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    nombre: '',
    direccion: '',
    telefono: '',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Barberías" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <Building className="text-[#D4AF37]" /> Barberías
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/barberias')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Crear Barbería
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {barberias.map((barberia) => (
          <Card key={barberia.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#D4AF37] text-black font-semibold">{barberia.nombre}</Badge>
              </div>
              <div className="text-sm text-neutral-300">{barberia.direccion}</div>
              <div className="text-xs text-neutral-400">Tel: {barberia.telefono}</div>
              <Link
                href={`/barberias/${barberia.id}`}
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
