import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { EntityActions } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { index, create, show, edit, destroy } from '@/routes/servicios';
import type { BreadcrumbItem, Servicio } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Servicios', href: index.url() },
];

interface Props {
    servicios: Servicio[];
}

export default function ServicioIndex({ servicios }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <div className="p-6">
                <PageHeader
                    title="Servicios"
                    description="Gestiona el catálogo de servicios"
                    createRoute={create()}
                    createLabel="Nuevo Servicio"
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {servicios.map((servicio) => (
                        <Card key={servicio.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(servicio.id))}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{servicio.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-1">${servicio.precio.toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground mb-3">{servicio.duracion_minutos} min</div>
                                <EntityActions
                                    showRoute={show(servicio.id)}
                                    editRoute={edit(servicio.id)}
                                    deleteRoute={destroy(servicio.id)}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {servicios.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay servicios registrados.</p>
                )}
            </div>
        </AppLayout>
    );
}
