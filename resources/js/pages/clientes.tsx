import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import type { Cliente } from '@/types/cliente';
import { useForm } from '@inertiajs/react';

interface Props {
  clientes: Cliente[];
}

export default function Clientes({ clientes }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    nombre: '',
    telefono: '',
    email: '',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Clientes" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <Users className="text-[#D4AF37]" /> Clientes
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/clientes')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Agregar Cliente
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => (
          <Card key={cliente.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <Badge className="bg-[#D4AF37] text-black font-semibold">{cliente.nombre}</Badge>
              <div className="text-sm text-neutral-300">Email: {cliente.email}</div>
              <div className="text-xs text-neutral-400">Tel: {cliente.telefono}</div>
              <Link
                href={`/clientes/${cliente.id}`}
                className="mt-2 text-[#D4AF37] font-medium hover:underline"
              >
                Ver historial
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
