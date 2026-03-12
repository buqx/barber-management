import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Badge, Card, CardContent } from '@/components/ui';
import { create, index, show } from '@/routes/ventas';
import type { BreadcrumbItem, Venta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ventas', href: index.url() },
];

interface Props {
    ventas: Venta[];
}

export default function VentaIndex({ ventas }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ventas" />
            <div className="p-6">
                <PageHeader
                    title="Ventas"
                    description="Historial de ventas registradas"
                    createRoute={create()}
                    createLabel="Nueva venta"
                />
                <div className="flex flex-col gap-3">
                    {ventas.map((venta) => (
                        <Card key={venta.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(venta.id))}>
                            <CardContent className="flex items-center justify-between py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground">{new Date(venta.created_at).toLocaleDateString('es-CO')}</span>
                                    <span className="text-xs text-muted-foreground">ID: {venta.id.substring(0, 8)}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{venta.tipo_origen}</Badge>
                                        <Badge>{venta.estado}</Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">Cliente: {venta.cliente?.nombre ?? 'Mostrador'}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">${venta.total.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">Subtotal: ${venta.subtotal.toLocaleString()}</div>
                                    {venta.utilidad_neta != null && (
                                        <div className="text-xs text-muted-foreground">Utilidad: ${venta.utilidad_neta.toLocaleString()}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {ventas.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay ventas registradas.</p>
                )}
            </div>
        </AppLayout>
    );
}
