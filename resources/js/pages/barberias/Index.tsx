import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { EntityActions } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { index, create, show, edit, destroy } from '@/routes/barberias';
import type { BreadcrumbItem, Barberia } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barberías', href: index.url() },
];

interface Props {
    barberias: Barberia[];
}

export default function BarberiaIndex({ barberias }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barberías" />
            <div className="p-6">
                <PageHeader
                    title="Barberías"
                    description="Gestiona las barberías registradas en el sistema"
                    createRoute={create()}
                    createLabel="Nueva Barbería"
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {barberias.map((barberia) => (
                        <Card key={barberia.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(barberia.id))}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{barberia.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-1">{barberia.slug}</div>
                                <div className="text-sm text-muted-foreground mb-3">
                                    {barberia.moneda} · {barberia.timezone}
                                </div>
                                <EntityActions
                                    showRoute={show(barberia.id)}
                                    editRoute={edit(barberia.id)}
                                    deleteRoute={destroy(barberia.id)}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {barberias.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay barberías registradas.</p>
                )}
            </div>
        </AppLayout>
    );
}
