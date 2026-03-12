import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { index, create, store } from '@/routes/servicios';
import type { Barberia, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Servicios', href: index.url() },
    { title: 'Nuevo', href: create.url() },
];

interface Props {
    barberias: Barberia[];
}

export default function ServicioCreate({ barberias }: Props) {
    const form = useForm({
        nombre: '',
        precio: '',
        duracion_minutos: '',
        barberia_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(store.url());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Servicio" />
            <div className="p-6 max-w-2xl">
                <PageHeader title="Nuevo Servicio" backRoute={index()} />
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
                            <div className="grid gap-2">
                                <Label htmlFor="barberia_id">Barbería *</Label>
                                <select
                                    id="barberia_id"
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    value={form.data.barberia_id}
                                    onChange={e => form.setData('barberia_id', e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una barbería</option>
                                    {barberias.map((barberia) => (
                                        <option key={barberia.id} value={barberia.id}>
                                            {barberia.nombre}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.barberia_id && <p className="text-sm text-destructive">{form.errors.barberia_id}</p>}
                            </div>
                            <Button type="submit" disabled={form.processing} className="w-fit">
                                {form.processing ? 'Guardando...' : 'Crear Servicio'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
