import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@/components/ui';
import { index, show } from '@/routes/ventas';
import type { BreadcrumbItem, Venta } from '@/types';

interface Props {
    venta: Venta;
}

export default function VentaShow({ venta }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ventas', href: index.url() },
        { title: `Venta ${venta.id.substring(0, 8)}`, href: show.url(venta.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Venta ${venta.id.substring(0, 8)}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title="Detalle de Venta" backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Información</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Total" value={`$${venta.total.toLocaleString()}`} />
                            <InfoField label="Utilidad neta" value={venta.utilidad_neta != null ? `$${venta.utilidad_neta.toLocaleString()}` : null} />
                            <InfoField label="Fecha" value={new Date(venta.created_at).toLocaleString('es-CO')} />
                            <InfoField label="ID Cliente" value={venta.cliente_id} />
                        </div>
                        <Separator />
                        <InfoField label="ID" value={venta.id} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
