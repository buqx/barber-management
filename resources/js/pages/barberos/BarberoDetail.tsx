  <Badge className="bg-[#D4AF37] text-black font-semibold">{barbero.nombre}</Badge>
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Edit, Trash } from 'lucide-react';
import type { Barbero } from '@/types/barbero';

interface Props {
  barbero: Barbero;
}

export default function BarberoDetail({ barbero }: Props) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Barbero: ${barbero.nombre}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <User className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">{barbero.nombre}</h2>
        </div>
        <div className="text-neutral-300 mb-2">Especialidad: {barbero.especialidad}</div>
        <div className="text-neutral-400 mb-4">Teléfono: {barbero.telefono}</div>
        <div className="flex gap-2">
          <Button variant="gold" className="bg-[#D4AF37] text-black font-semibold" asChild>
            <Link href={`/barberos/${barbero.id}/edit`}><Edit className="mr-2" /> Editar</Link>
          </Button>
          <Button variant="destructive" className="bg-red-600 text-white font-semibold" asChild>
            <Link href={`/barberos/${barbero.id}/delete`}><Trash className="mr-2" /> Eliminar</Link>
          </Button>
        </div>
      </Card>
      <Link href="/barberos" className="text-[#D4AF37] font-medium hover:underline">Volver a barberos</Link>
    </div>
  );
}
