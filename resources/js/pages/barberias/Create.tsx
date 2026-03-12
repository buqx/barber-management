import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { index, create, store } from '@/routes/barberias';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barberías', href: index.url() },
    { title: 'Nueva', href: create.url() },
];

export default function BarberiaCreate() {
    const form = useForm({
        nombre: '',
        slug: '',
        telefono: '',
        email: '',
        moneda: 'COP',
        timezone: 'America/Bogota',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(store.url());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Barbería" />
            <div className="p-6 max-w-2xl">
                <PageHeader title="Nueva Barbería" backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Datos de la barbería</CardTitle>
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
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={e => form.setData('slug', e.target.value)}
                                    required
                                />
                                {form.errors.slug && <p className="text-sm text-destructive">{form.errors.slug}</p>}
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="moneda">Moneda</Label>
                                <Input
                                    id="moneda"
                                    value={form.data.moneda}
                                    onChange={e => form.setData('moneda', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="timezone">Zona horaria</Label>
                                <Input
                                    id="timezone"
                                    value={form.data.timezone}
                                    onChange={e => form.setData('timezone', e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={form.processing} className="w-fit">
                                {form.processing ? 'Guardando...' : 'Crear Barbería'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
