import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { index, show, edit, update } from '@/routes/servicios';
import type { BreadcrumbItem, Servicio } from '@/types';

interface Props {
    servicio: Servicio;
}

export default function ServicioEdit({ servicio }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Servicios', href: index.url() },
        { title: servicio.nombre, href: show.url(servicio.id) },
        { title: 'Editar', href: edit.url(servicio.id) },
    ];

    const form = useForm({
        nombre: servicio.nombre,
        precio: servicio.precio.toString(),
        duracion_minutos: servicio.duracion_minutos.toString(),
        barberia_id: servicio.barberia_id,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put(update.url(servicio.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${servicio.nombre}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={`Editar ${servicio.nombre}`} backRoute={show(servicio.id)} />
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del servicio</CardTitle>
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
                                <Label htmlFor="precio">Precio *</Label>
                                <Input
                                    id="precio"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.precio}
                                    onChange={e => form.setData('precio', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duracion_minutos">Duración (minutos) *</Label>
                                <Input
                                    id="duracion_minutos"
                                    type="number"
                                    min="1"
                                    value={form.data.duracion_minutos}
                                    onChange={e => form.setData('duracion_minutos', e.target.value)}
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
