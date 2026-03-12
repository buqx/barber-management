import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Checkbox } from '@/components/ui';
import { index, show, edit, update } from '@/routes/barberos';
import type { BreadcrumbItem, Barbero } from '@/types';

interface Props {
    barbero: Barbero;
}

export default function BarberoEdit({ barbero }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barberos', href: index.url() },
        { title: barbero.nombre, href: show.url(barbero.id) },
        { title: 'Editar', href: edit.url(barbero.id) },
    ];

    const form = useForm({
        nombre: barbero.nombre,
        email: barbero.email ?? '',
        barberia_id: barbero.barberia_id,
        es_dueno: barbero.es_dueno,
        comision_porcentaje: barbero.comision_porcentaje?.toString() ?? '',
        activo: barbero.activo,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put(update.url(barbero.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${barbero.nombre}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={`Editar ${barbero.nombre}`} backRoute={show(barbero.id)} />
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del barbero</CardTitle>
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="comision_porcentaje">Comisión (%)</Label>
                                <Input
                                    id="comision_porcentaje"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.data.comision_porcentaje}
                                    onChange={e => form.setData('comision_porcentaje', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="es_dueno"
                                    checked={form.data.es_dueno}
                                    onCheckedChange={v => form.setData('es_dueno', Boolean(v))}
                                />
                                <Label htmlFor="es_dueno">Es dueño</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="activo"
                                    checked={form.data.activo}
                                    onCheckedChange={v => form.setData('activo', Boolean(v))}
                                />
                                <Label htmlFor="activo">Activo</Label>
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
