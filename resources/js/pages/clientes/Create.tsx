import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { index, create, store } from '@/routes/clientes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: index.url() },
    { title: 'Nuevo', href: create.url() },
];

export default function ClienteCreate() {
    const form = useForm({
        nombre: '',
        telefono: '',
        email: '',
        barberia_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(store.url());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Cliente" />
            <div className="p-6 max-w-2xl">
                <PageHeader title="Nuevo Cliente" backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del cliente</CardTitle>
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
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={form.data.telefono}
                                    onChange={e => form.setData('telefono', e.target.value)}
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
                            </div>
                            <Button type="submit" disabled={form.processing} className="w-fit">
                                {form.processing ? 'Guardando...' : 'Crear Cliente'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
