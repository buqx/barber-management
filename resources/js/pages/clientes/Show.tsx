import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from '@/components/ui';
import { index, show, edit, destroy } from '@/routes/clientes';
import type { BreadcrumbItem, Cliente } from '@/types';

interface Props {
    cliente: Cliente;
}

export default function ClienteShow({ cliente }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Clientes', href: index.url() },
        { title: cliente.nombre, href: show.url(cliente.id) },
    ];

    const form = useForm();

    function handleDelete() {
        if (confirm(`¿Eliminar al cliente "${cliente.nombre}"?`)) {
            form.delete(destroy.url(cliente.id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={cliente.nombre} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={cliente.nombre} backRoute={index()} />
                <Card>
                    <CardHeader>
                        <CardTitle>Información</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Nombre" value={cliente.nombre} />
                            <InfoField label="Email" value={cliente.email} />
                            <InfoField label="Teléfono" value={cliente.telefono} />
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button onClick={() => router.visit(edit.url(cliente.id))}>
                                Editar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={form.processing}>
                                Eliminar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
