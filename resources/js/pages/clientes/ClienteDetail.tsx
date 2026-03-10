  <Badge className="bg-[#D4AF37] text-black font-semibold">{cliente.nombre}</Badge>
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Edit, Trash } from 'lucide-react';
import type { Cliente } from '@/types/cliente';

interface Props {
  cliente: Cliente;
}

export default function ClienteDetail({ cliente }: Props) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Cliente: ${cliente.nombre}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Users className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">{cliente.nombre}</h2>
        </div>
        <div className="text-neutral-300 mb-2">Email: {cliente.email}</div>
        <div className="text-neutral-400 mb-4">Teléfono: {cliente.telefono}</div>
        <div className="flex gap-2">
          <Button variant="gold" className="bg-[#D4AF37] text-black font-semibold" asChild>
            <Link href={`/clientes/${cliente.id}/edit`}><Edit className="mr-2" /> Editar</Link>
          </Button>
          <Button variant="destructive" className="bg-red-600 text-white font-semibold" asChild>
            <Link href={`/clientes/${cliente.id}/delete`}><Trash className="mr-2" /> Eliminar</Link>
          </Button>
        </div>
      </Card>
      <Link href="/clientes" className="text-[#D4AF37] font-medium hover:underline">Volver a clientes</Link>
    </div>
  );
}
