import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { index, show, edit, update } from '@/routes/productos';
import type { BreadcrumbItem, Producto } from '@/types';

interface Props {
    producto: Producto;
}

export default function ProductoEdit({ producto }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Productos', href: index.url() },
        { title: producto.nombre, href: show.url(producto.id) },
        { title: 'Editar', href: edit.url(producto.id) },
    ];

    const form = useForm({
        nombre: producto.nombre,
        stock_actual: producto.stock_actual.toString(),
        precio_costo: producto.precio_costo?.toString() ?? '',
        precio_venta: producto.precio_venta.toString(),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put(update.url(producto.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${producto.nombre}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={`Editar ${producto.nombre}`} backRoute={show(producto.id)} />
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del producto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    value={form.data.nombre}
                                    onChange={e => form.setData('nombre', e.target.value)}
                                    required
                                />
                                {form.errors.nombre && <p className="text-sm text-destructive">{form.errors.nombre}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="precio_venta">Precio de venta *</Label>
                                <Input
                                    id="precio_venta"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.precio_venta}
                                    onChange={e => form.setData('precio_venta', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="precio_costo">Precio de costo</Label>
                                <Input
                                    id="precio_costo"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.precio_costo}
                                    onChange={e => form.setData('precio_costo', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock_actual">Stock *</Label>
                                <Input
                                    id="stock_actual"
                                    type="number"
                                    min="0"
                                    value={form.data.stock_actual}
                                    onChange={e => form.setData('stock_actual', e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={form.processing} className="w-fit">
                                {form.processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
