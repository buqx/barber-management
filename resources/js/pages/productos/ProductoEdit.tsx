import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import type { Producto } from '@/types/producto';

interface Props {
  producto: Producto;
}

export default function ProductoEdit({ producto }: Props) {
  const form = useForm({
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Editar Producto: ${producto.nombre}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <ShoppingBag className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Editar {producto.nombre}</h2>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.put(`/productos/${producto.id}`);
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
            type="number"
            value={form.data.precio}
            onChange={e => form.setData('precio', Number(e.target.value))}
            placeholder="Precio"
            className="bg-neutral-800 text-neutral-100 p-2 rounded"
            required
          />
          <input
            type="number"
            value={form.data.stock}
            onChange={e => form.setData('stock', Number(e.target.value))}
            placeholder="Stock"
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
      <Link href={`/productos/${producto.id}`} className="text-[#D4AF37] font-medium hover:underline">Volver al detalle</Link>
    </div>
  );
}
