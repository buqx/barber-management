import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator } from '@/components/ui';
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
                        <CardTitle className="flex items-center gap-2">
                            Información
                            <Badge variant="outline">{venta.tipo_origen}</Badge>
                            <Badge>{venta.estado}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Origen" value={venta.tipo_origen} />
                            <InfoField label="Total" value={`$${venta.total.toLocaleString()}`} />
                            <InfoField label="Subtotal" value={`$${venta.subtotal.toLocaleString()}`} />
                            <InfoField label="Descuento" value={`$${venta.descuento.toLocaleString()}`} />
                            <InfoField label="Utilidad neta" value={venta.utilidad_neta != null ? `$${venta.utilidad_neta.toLocaleString()}` : null} />
                            <InfoField label="Fecha" value={new Date(venta.created_at).toLocaleString('es-CO')} />
                            <InfoField label="Cliente" value={venta.cliente?.nombre ?? 'Mostrador'} />
                            <InfoField label="Barbero" value={venta.barbero?.nombre ?? '—'} />
                            <InfoField label="Cita" value={venta.cita ? venta.cita.id.substring(0, 8) : '—'} />
                        </div>
                        {venta.detalles && venta.detalles.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm font-semibold mb-2">Items vendidos</p>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 font-medium">Tipo</th>
                                                <th className="text-left py-2 font-medium">Descripción</th>
                                                <th className="text-right py-2 font-medium">Cant.</th>
                                                <th className="text-right py-2 font-medium">Precio unit.</th>
                                                <th className="text-right py-2 font-medium">Subtotal</th>
                                                <th className="text-right py-2 font-medium">Utilidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {venta.detalles.map((d) => (
                                                <tr key={d.id} className="border-b last:border-0">
                                                    <td className="py-2 capitalize">{d.tipo_item}</td>
                                                    <td className="py-2">{d.descripcion ?? d.servicio?.nombre ?? d.producto?.nombre ?? '—'}</td>
                                                    <td className="py-2 text-right">{d.cantidad}</td>
                                                    <td className="py-2 text-right">${d.precio_venta.toLocaleString()}</td>
                                                    <td className="py-2 text-right">${d.subtotal.toLocaleString()}</td>
                                                    <td className="py-2 text-right">${d.utilidad_neta.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        {venta.observaciones && (
                            <>
                                <Separator />
                                <InfoField label="Observaciones" value={venta.observaciones} />
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

