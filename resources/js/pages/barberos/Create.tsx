import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Checkbox } from '@/components/ui';
import { index, create, store } from '@/routes/barberos';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barberos', href: index.url() },
    { title: 'Nuevo', href: create.url() },
];

export default function BarberoCreate() {
    const form = useForm({
        nombre: '',
        email: '',
        barberia_id: '',
        es_dueno: false,
        comision_porcentaje: '',
        activo: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(store.url());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Barbero" />
            <div className="p-6 max-w-2xl">
                <PageHeader title="Nuevo Barbero" backRoute={index()} />
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
                                <Label htmlFor="barberia_id">ID Barbería *</Label>
                                <Input
                                    id="barberia_id"
                                    value={form.data.barberia_id}
                                    onChange={e => form.setData('barberia_id', e.target.value)}
                                    required
                                />
                                {form.errors.barberia_id && <p className="text-sm text-destructive">{form.errors.barberia_id}</p>}
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
                                {form.processing ? 'Guardando...' : 'Crear Barbero'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
