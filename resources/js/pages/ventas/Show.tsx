import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@/components/ui';
import { index, show } from '@/routes/ventas';
import type { BreadcrumbItem, Venta, VentaDetalle } from '@/types';

interface Props {
    venta: Venta & { detalles?: VentaDetalle[] };
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
                        {venta.detalles && venta.detalles.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm font-semibold mb-2">Servicios incluidos</p>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 font-medium">Servicio</th>
                                                <th className="text-right py-2 font-medium">Precio venta</th>
                                                <th className="text-right py-2 font-medium">Precio costo</th>
                                                <th className="text-right py-2 font-medium">Utilidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {venta.detalles.map((d) => (
                                                <tr key={d.id} className="border-b last:border-0">
                                                    <td className="py-2">{d.servicio?.nombre ?? d.servicio_id}</td>
                                                    <td className="py-2 text-right">${d.precio_venta.toLocaleString()}</td>
                                                    <td className="py-2 text-right">${d.precio_costo.toLocaleString()}</td>
                                                    <td className="py-2 text-right">${d.utilidad_neta.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        <Separator />
                        <InfoField label="ID" value={venta.id} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

