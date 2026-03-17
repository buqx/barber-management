import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import type { BreadcrumbItem, Barberia } from '@/types';

interface FormData {
    nombre: string;
    slug: string;
    telefono: string;
    moneda: string;
    timezone: string;
}

interface Props {
    barberia: Barberia;
}

export default function BarberiaEdit({ barberia }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barberías', href: '/barberias' },
        { title: barberia.nombre, href: `/barberias/${barberia.id}` },
        { title: 'Editar', href: `/barberias/${barberia.id}/edit` },
    ];

    const form = useForm<FormData>({
        nombre: barberia.nombre,
        slug: barberia.slug,
        telefono: barberia.telefono ?? '',
        moneda: barberia.moneda,
        timezone: barberia.timezone,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put(`/barberias/${barberia.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${barberia.nombre}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={`Editar ${barberia.nombre}`} backRoute={`/barberias/${barberia.id}`} />
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
                                {form.processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
