import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from '@/components/ui';
import { router } from '@inertiajs/react';
import { index, show, edit, destroy } from '@/routes/barberias';
import type { BreadcrumbItem, Barberia } from '@/types';

interface Props {
    barberia: Barberia;
}

export default function BarberiaShow({ barberia }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barberías', href: index.url() },
        { title: barberia.nombre, href: show.url(barberia.id) },
    ];

    const form = useForm();

    function handleDelete() {
        if (confirm(`¿Eliminar la barbería "${barberia.nombre}"?`)) {
            form.delete(destroy.url(barberia.id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={barberia.nombre} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={barberia.nombre} backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Información</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Nombre" value={barberia.nombre} />
                            <InfoField label="Slug" value={barberia.slug} />
                            <InfoField label="Teléfono" value={barberia.telefono} />
                            <InfoField label="Email" value={barberia.email} />
                            <InfoField label="Moneda" value={barberia.moneda} />
                            <InfoField label="Zona horaria" value={barberia.timezone} />
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button onClick={() => router.visit(edit.url(barberia.id))}>
                                Editar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={form.processing}>
                                Eliminar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
