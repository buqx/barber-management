import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from '@/components/ui';
import { index, show, edit, destroy } from '@/routes/servicios';
import type { BreadcrumbItem, Servicio } from '@/types';

interface Props {
    servicio: Servicio;
}

export default function ServicioShow({ servicio }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Servicios', href: index.url() },
        { title: servicio.nombre, href: show.url(servicio.id) },
    ];

    const form = useForm();

    function handleDelete() {
        if (confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) {
            form.delete(destroy.url(servicio.id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={servicio.nombre} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={servicio.nombre} backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Información</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Nombre" value={servicio.nombre} />
                            <InfoField label="Precio" value={`$${servicio.precio.toLocaleString()}`} />
                            <InfoField label="Duración" value={`${servicio.duracion_minutos} min`} />
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button onClick={() => router.visit(edit.url(servicio.id))}>
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
