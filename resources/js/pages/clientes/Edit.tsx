import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
import { index, show, edit, update } from '@/routes/clientes';
import type { BreadcrumbItem, Cliente } from '@/types';

interface Props {
    cliente: Cliente;
}

export default function ClienteEdit({ cliente }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Clientes', href: index.url() },
        { title: cliente.nombre, href: show.url(cliente.id) },
        { title: 'Editar', href: edit.url(cliente.id) },
    ];

    const form = useForm({
        nombre: cliente.nombre,
        email: cliente.email ?? '',
        telefono: cliente.telefono ?? '',
        barberia_id: cliente.barberia_id,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put(update.url(cliente.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${cliente.nombre}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={`Editar ${cliente.nombre}`} backRoute={show(cliente.id)} />
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
