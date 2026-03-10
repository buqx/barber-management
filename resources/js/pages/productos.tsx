import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus } from 'lucide-react';
import type { Producto } from '@/types/producto';
import { useForm } from '@inertiajs/react';

interface Props {
  productos: Producto[];
}

export default function Productos({ productos }: Props) {
  const { auth } = usePage().props;
  const form = useForm({
    nombre: '',
    precio: 0,
    stock: 0,
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title="Productos" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
          <ShoppingBag className="text-[#D4AF37]" /> Productos
        </h1>
        <Button
          variant="default"
          onClick={() => form.post('/productos')}
          className="bg-[#D4AF37] text-black font-semibold"
        >
          <Plus className="mr-2" /> Agregar Producto
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <Card key={producto.id} className="bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-2 p-4">
              <Badge className="bg-[#D4AF37] text-black font-semibold">{producto.nombre}</Badge>
              <div className="text-sm text-neutral-300">Stock: {producto.stock}</div>
              <div className="text-xs text-neutral-400">Precio: ${producto.precio}</div>
              <Link
                href={`/productos/${producto.id}`}
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
