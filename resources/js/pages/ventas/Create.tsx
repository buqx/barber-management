import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Label, Separator } from '@/components/ui';
import { create, index, store } from '@/routes/ventas';
import type { Barbero, BreadcrumbItem, Cita, Cliente, Producto, Servicio } from '@/types';

type CitaVenta = Cita;

interface ProductFormRow {
    producto_id: string;
    cantidad: number;
}

interface Props {
    cita: CitaVenta | null;
    citas: CitaVenta[];
    servicios: Servicio[];
    productos: Producto[];
    clientes: Cliente[];
    barberos: Barbero[];
}

const NONE_VALUE = '__none__';

export default function VentaCreate({ cita, citas, servicios, productos, clientes, barberos }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ventas', href: index.url() },
        { title: 'Nueva', href: create.url() },
    ];

    const form = useForm({
        cita_id: cita?.id ?? '',
        barbero_id: cita?.barbero_id ?? '',
        cliente_id: cita?.cliente_id ?? '',
        cliente_nombre: '',
        cliente_email: '',
        cliente_telefono: '',
        servicios: [] as string[],
        productos: [] as ProductFormRow[],
        observaciones: '',
    });

    const selectedCita = (form.data.cita_id ? citas.find(item => item.id === form.data.cita_id) : cita) ?? null;
    const isLinkedToCita = Boolean(selectedCita);
    const selectedServices = servicios.filter(servicio => form.data.servicios.includes(servicio.id));
    const selectedProducts = form.data.productos
        .map(item => ({
            ...item,
            producto: productos.find(producto => producto.id === item.producto_id) ?? null,
        }))
        .filter(item => item.producto !== null);

    const subtotalServicios = selectedServices.reduce((sum, servicio) => sum + Number(servicio.precio), 0);
    const subtotalProductos = selectedProducts.reduce((sum, item) => sum + (Number(item.producto?.precio_venta ?? 0) * item.cantidad), 0);
    const subtotal = subtotalServicios + subtotalProductos;
    const utilidad = subtotalServicios + selectedProducts.reduce(
        (sum, item) => sum + ((Number(item.producto?.precio_venta ?? 0) - Number(item.producto?.precio_costo ?? 0)) * item.cantidad),
        0,
    );

    const applyCita = (citaId: string) => {
        const nextCita = citas.find(item => item.id === citaId) ?? null;

        form.setData(data => ({
            ...data,
            cita_id: nextCita?.id ?? '',
            barbero_id: nextCita?.barbero_id ?? '',
            cliente_id: nextCita?.cliente_id ?? '',
        }));
    };

    const toggleServicio = (servicioId: string) => {
        form.setData('servicios', form.data.servicios.includes(servicioId)
            ? form.data.servicios.filter(id => id !== servicioId)
            : [...form.data.servicios, servicioId]);
    };

    const toggleProducto = (productoId: string) => {
        const exists = form.data.productos.some(item => item.producto_id === productoId);

        form.setData('productos', exists
            ? form.data.productos.filter(item => item.producto_id !== productoId)
            : [...form.data.productos, { producto_id: productoId, cantidad: 1 }]);
    };

    const updateCantidadProducto = (productoId: string, cantidad: number) => {
        form.setData('productos', form.data.productos.map(item => (
            item.producto_id === productoId ? { ...item, cantidad: Number.isNaN(cantidad) ? 1 : Math.max(1, cantidad) } : item
        )));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva venta" />
            <div className="p-6 max-w-6xl">
                <PageHeader title="Nueva venta" description="Registra servicios y productos vendidos desde cita o mostrador" backRoute={index()} />

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contexto de la venta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cita_id">Relacionar con cita</Label>
                                    <select
                                        id="cita_id"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={form.data.cita_id || NONE_VALUE}
                                        onChange={e => applyCita(e.target.value === NONE_VALUE ? '' : e.target.value)}
                                    >
                                        <option value={NONE_VALUE}>Venta de mostrador / sin cita</option>
                                        {citas.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {new Date(item.inicio_at).toLocaleString('es-CO')} · {item.barbero?.nombre ?? item.barbero_id} · {item.cliente?.nombre ?? item.cliente_id}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedCita && (
                                    <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Badge>{selectedCita.estado}</Badge>
                                            <span>Cita {selectedCita.id.slice(0, 8)}</span>
                                        </div>
                                        <p>Barbero: {selectedCita.barbero?.nombre ?? selectedCita.barbero_id}</p>
                                        <p>Cliente: {selectedCita.cliente?.nombre ?? selectedCita.cliente_id}</p>
                                        <p>Fecha: {new Date(selectedCita.inicio_at).toLocaleString('es-CO')}</p>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="barbero_id">Barbero responsable *</Label>
                                        <select
                                            id="barbero_id"
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.data.barbero_id || NONE_VALUE}
                                            onChange={e => form.setData('barbero_id', e.target.value === NONE_VALUE ? '' : e.target.value)}
                                            disabled={isLinkedToCita}
                                        >
                                            <option value={NONE_VALUE}>Selecciona un barbero</option>
                                            {barberos.map(barbero => (
                                                <option key={barbero.id} value={barbero.id}>{barbero.nombre}</option>
                                            ))}
                                        </select>
                                        {form.errors.barbero_id && <p className="text-sm text-destructive">{form.errors.barbero_id}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cliente_id">Cliente registrado</Label>
                                        <select
                                            id="cliente_id"
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.data.cliente_id || NONE_VALUE}
                                            onChange={e => form.setData('cliente_id', e.target.value === NONE_VALUE ? '' : e.target.value)}
                                            disabled={isLinkedToCita}
                                        >
                                            <option value={NONE_VALUE}>Venta sin cliente registrado</option>
                                            {clientes.map(cliente => (
                                                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {!isLinkedToCita && !form.data.cliente_id && (
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cliente_nombre">Nombre cliente mostrador</Label>
                                            <Input id="cliente_nombre" value={form.data.cliente_nombre} onChange={e => form.setData('cliente_nombre', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cliente_email">Email</Label>
                                            <Input id="cliente_email" type="email" value={form.data.cliente_email} onChange={e => form.setData('cliente_email', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cliente_telefono">Teléfono</Label>
                                            <Input id="cliente_telefono" value={form.data.cliente_telefono} onChange={e => form.setData('cliente_telefono', e.target.value)} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Servicios</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 md:grid-cols-2">
                                {servicios.map(servicio => (
                                    <label key={servicio.id} className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
                                        <Checkbox checked={form.data.servicios.includes(servicio.id)} onCheckedChange={() => toggleServicio(servicio.id)} />
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm">{servicio.nombre}</p>
                                            <p className="text-xs text-muted-foreground">{servicio.duracion_minutos} min</p>
                                            <p className="text-xs text-muted-foreground">${Number(servicio.precio).toLocaleString()}</p>
                                        </div>
                                    </label>
                                ))}
                                {servicios.length === 0 && <p className="text-sm text-muted-foreground">No hay servicios disponibles.</p>}
                                {form.errors.servicios && <p className="text-sm text-destructive md:col-span-2">{form.errors.servicios}</p>}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Productos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {productos.map(producto => {
                                    const selected = form.data.productos.find(item => item.producto_id === producto.id);

                                    return (
                                        <div key={producto.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <Checkbox checked={Boolean(selected)} onCheckedChange={() => toggleProducto(producto.id)} />
                                                <div className="space-y-1">
                                                    <p className="font-medium text-sm">{producto.nombre}</p>
                                                    <p className="text-xs text-muted-foreground">Stock: {producto.stock_actual}</p>
                                                    <p className="text-xs text-muted-foreground">Venta: ${Number(producto.precio_venta).toLocaleString()}</p>
                                                </div>
                                            </label>
                                            {selected && (
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor={`qty-${producto.id}`}>Cant.</Label>
                                                    <Input
                                                        id={`qty-${producto.id}`}
                                                        type="number"
                                                        min="1"
                                                        max={String(producto.stock_actual)}
                                                        className="w-24"
                                                        value={selected.cantidad}
                                                        onChange={e => updateCantidadProducto(producto.id, Number(e.target.value))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {productos.length === 0 && <p className="text-sm text-muted-foreground">No hay productos disponibles.</p>}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span>Servicios</span>
                                        <span>${subtotalServicios.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Productos</span>
                                        <span>${subtotalProductos.toLocaleString()}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Utilidad estimada</span>
                                        <span>${utilidad.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <textarea
                                        id="observaciones"
                                        className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={form.data.observaciones}
                                        onChange={e => form.setData('observaciones', e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={form.processing || subtotal <= 0}>
                                    {form.processing ? 'Registrando venta...' : 'Registrar venta'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}