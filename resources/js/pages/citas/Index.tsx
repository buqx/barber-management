import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Badge, Card, CardContent } from '@/components/ui';
import { index, show } from '@/routes/citas';
import type { BreadcrumbItem, Cita } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Citas', href: index.url() },
];

const estadoVariant: Record<Cita['estado'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendiente: 'outline',
    confirmada: 'default',
    completada: 'secondary',
    cancelada: 'destructive',
};

interface Props {
    citas: Cita[];
}

export default function CitaIndex({ citas }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Citas" />
            <div className="p-6">
                <PageHeader
                    title="Citas"
                    description="Historial y estado de todas las citas"
                />
                <div className="flex flex-col gap-3">
                    {citas.map((cita) => (
                        <Card key={cita.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(cita.id))}>
                            <CardContent className="flex items-center justify-between py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-sm">{new Date(cita.inicio_at).toLocaleString('es-CO')}</span>
                                    <span className="text-xs text-muted-foreground">Barbero: {cita.barbero_id}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {cita.total_pagado != null && (
                                        <span className="text-sm font-medium">${cita.total_pagado.toLocaleString()}</span>
                                    )}
                                    <Badge variant={estadoVariant[cita.estado]}>{cita.estado}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {citas.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay citas registradas.</p>
                )}
            </div>
        </AppLayout>
    );
}
