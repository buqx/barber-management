import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { EntityActions } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { index, create, show, edit, destroy } from '@/routes/productos';
import type { BreadcrumbItem, Producto } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Productos', href: index.url() },
];

interface Props {
    productos: Producto[];
}

export default function ProductoIndex({ productos }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />
            <div className="p-6">
                <PageHeader
                    title="Productos"
                    description="Gestiona el inventario de productos"
                    createRoute={create()}
                    createLabel="Nuevo Producto"
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {productos.map((producto) => (
                        <Card key={producto.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(producto.id))}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{producto.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-1">Venta: ${producto.precio_venta.toLocaleString()}</div>
                                {producto.precio_costo != null && (
                                    <div className="text-sm text-muted-foreground mb-1">Costo: ${producto.precio_costo.toLocaleString()}</div>
                                )}
                                <div className="text-sm text-muted-foreground mb-3">Stock: {producto.stock_actual}</div>
                                <EntityActions
                                    showRoute={show(producto.id)}
                                    editRoute={edit(producto.id)}
                                    deleteRoute={destroy(producto.id)}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {productos.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay productos registrados.</p>
                )}
            </div>
        </AppLayout>
    );
}
