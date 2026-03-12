import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from '@/components/ui';
import { index, show, edit, destroy } from '@/routes/productos';
import type { BreadcrumbItem, Producto } from '@/types';

interface Props {
    producto: Producto;
}

export default function ProductoShow({ producto }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Productos', href: index.url() },
        { title: producto.nombre, href: show.url(producto.id) },
    ];

    const form = useForm();

    function handleDelete() {
        if (confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
            form.delete(destroy.url(producto.id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={producto.nombre} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={producto.nombre} backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Información</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Nombre" value={producto.nombre} />
                            <InfoField label="Precio de venta" value={`$${producto.precio_venta.toLocaleString()}`} />
                            <InfoField label="Precio de costo" value={producto.precio_costo != null ? `$${producto.precio_costo.toLocaleString()}` : null} />
                            <InfoField label="Stock" value={producto.stock_actual} />
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button onClick={() => router.visit(edit.url(producto.id))}>
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
