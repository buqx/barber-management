import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { EntityActions } from '@/components/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { index, create, show, edit, destroy } from '@/routes/clientes';
import type { BreadcrumbItem, Cliente } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: index.url() },
];

interface Props {
    clientes: Cliente[];
}

export default function ClienteIndex({ clientes }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />
            <div className="p-6">
                <PageHeader
                    title="Clientes"
                    description="Gestiona los clientes registrados"
                    createRoute={create()}
                    createLabel="Nuevo Cliente"
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clientes.map((cliente) => (
                        <Card key={cliente.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(cliente.id))}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{cliente.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-1">{cliente.email ?? '—'}</div>
                                <div className="text-sm text-muted-foreground mb-3">{cliente.telefono ?? '—'}</div>
                                <EntityActions
                                    showRoute={show(cliente.id)}
                                    editRoute={edit(cliente.id)}
                                    deleteRoute={destroy(cliente.id)}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {clientes.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay clientes registrados.</p>
                )}
            </div>
        </AppLayout>
    );
}
