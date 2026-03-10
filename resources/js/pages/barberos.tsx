import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Plus } from 'lucide-react';
import type { Barbero } from '@/types/barbero';
import { useForm } from '@inertiajs/react';

interface Props {
  barberos: Barbero[];
}

export default function Barberos({ barberos }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    nombre: '',
    especialidad: '',
    telefono: '',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Barberos" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <User className="text-[#D4AF37]" /> Barberos
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/barberos')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Agregar Barbero
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {barberos.map((barbero) => (
          <Card key={barbero.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <Badge className="bg-[#D4AF37] text-black font-semibold">{barbero.nombre}</Badge>
              <div className="text-sm text-neutral-300">Especialidad: {barbero.especialidad}</div>
              <div className="text-xs text-neutral-400">Tel: {barbero.telefono}</div>
              <Link
                href={`/barberos/${barbero.id}`}
                className="mt-2 text-[#D4AF37] font-medium hover:underline"
              >
                Ver perfil
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
