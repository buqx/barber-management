import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import type { Cliente } from '@/types/cliente';

interface Props {
  cliente: Cliente;
}

export default function ClienteEdit({ cliente }: Props) {
  const form = useForm({
    nombre: cliente.nombre,
    email: cliente.email,
    telefono: cliente.telefono,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Editar Cliente: ${cliente.nombre}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Users className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Editar {cliente.nombre}</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.put(`/clientes/${cliente.id}`);
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
            type="email"
            value={form.data.email}
            onChange={e => form.setData('email', e.target.value)}
            placeholder="Email"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="text"
            value={form.data.telefono}
            onChange={e => form.setData('telefono', e.target.value)}
            placeholder="Teléfono"
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
      <Link href={`/clientes/${cliente.id}`} className="text-[#D4AF37] font-medium hover:underline">Volver al detalle</Link>
    </div>
  );
}
