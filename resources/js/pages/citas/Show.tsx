import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from '@/components/ui';
import { index, show } from '@/routes/citas';
import type { BreadcrumbItem, Cita } from '@/types';

interface Props {
    cita: Cita;
}

const estadoVariant: Record<Cita['estado'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendiente: 'outline',
    confirmada: 'default',
    completada: 'secondary',
    cancelada: 'destructive',
};

export default function CitaShow({ cita }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Citas', href: index.url() },
        { title: `Cita ${cita.id.substring(0, 8)}`, href: show.url(cita.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Cita ${cita.id.substring(0, 8)}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title="Detalle de Cita" backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Cita
                            <Badge variant={estadoVariant[cita.estado]}>{cita.estado}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Inicio" value={new Date(cita.inicio_at).toLocaleString('es-CO')} />
                            <InfoField label="Fin" value={new Date(cita.fin_at).toLocaleString('es-CO')} />
                            <InfoField label="ID Barbero" value={cita.barbero_id} />
                            <InfoField label="ID Cliente" value={cita.cliente_id} />
                            <InfoField label="Total pagado" value={cita.total_pagado != null ? `$${cita.total_pagado.toLocaleString()}` : null} />
                        </div>
                        <Separator />
                        <InfoField label="ID" value={cita.id} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
