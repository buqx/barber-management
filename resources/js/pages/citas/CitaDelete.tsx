import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trash } from 'lucide-react';
import type { Cita } from '@/types/cita';

interface Props {
  cita: Cita;
}

export default function CitaDelete({ cita }: Props) {
  const form = useForm();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col gap-6">
      <Head title={`Eliminar Cita: ${cita.id}`} />
      <Card className="bg-neutral-900 border border-neutral-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-neutral-100">Eliminar Cita #{cita.id}</h2>
        </div>
        <p className="mb-4">¿Seguro que deseas eliminar esta cita?</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            form.delete(`/citas/${cita.id}`);
          }}
        >
          <Button
            type="submit"
            variant="destructive"
            className="bg-red-600 text-white font-semibold"
          >
            <Trash className="mr-2" /> Eliminar
          </Button>
        </form>
      </Card>
      <Link href={`/citas/${cita.id}`} className="text-[#D4AF37] font-medium hover:underline">Cancelar</Link>
    </div>
  );
}
