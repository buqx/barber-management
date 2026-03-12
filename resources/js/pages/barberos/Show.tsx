import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField, BoolBadge } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator, Badge } from '@/components/ui';
import { index, show, edit, destroy } from '@/routes/barberos';
import type { BreadcrumbItem, Barbero } from '@/types';

interface Props {
    barbero: Barbero;
}

export default function BarberoShow({ barbero }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barberos', href: index.url() },
        { title: barbero.nombre, href: show.url(barbero.id) },
    ];

    const form = useForm();

    function handleDelete() {
        if (confirm(`¿Eliminar al barbero "${barbero.nombre}"?`)) {
            form.delete(destroy.url(barbero.id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={barbero.nombre} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={barbero.nombre} backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {barbero.nombre}
                            <BoolBadge value={barbero.activo} trueLabel="Activo" falseLabel="Inactivo" />
                            {barbero.es_dueno && <Badge variant="secondary">Dueño</Badge>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Nombre" value={barbero.nombre} />
                            <InfoField label="Email" value={barbero.email} />
                            <InfoField label="Comisión" value={barbero.comision_porcentaje != null ? `${barbero.comision_porcentaje}%` : null} />
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button onClick={() => router.visit(edit.url(barbero.id))}>
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
