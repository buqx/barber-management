import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { EntityActions, BoolBadge } from '@/components/primitives';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { index, create, show, edit, destroy } from '@/routes/barberos';
import type { BreadcrumbItem, Barbero } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barberos', href: index.url() },
];

interface Props {
    barberos: Barbero[];
}

export default function BarberoIndex({ barberos }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barberos" />
            <div className="p-6">
                <PageHeader
                    title="Barberos"
                    description="Gestiona los barberos del equipo"
                    createRoute={create()}
                    createLabel="Nuevo Barbero"
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {barberos.map((barbero) => (
                        <Card key={barbero.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.visit(show.url(barbero.id))}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={barbero.foto_url ?? undefined} alt={barbero.nombre} />
                                            <AvatarFallback>{barbero.nombre.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{barbero.nombre}</CardTitle>
                                            <div className="text-xs text-muted-foreground">CC: {barbero.cedula ?? '—'}</div>
                                        </div>
                                    </div>
                                    <BoolBadge value={barbero.activo} trueLabel="Activo" falseLabel="Inactivo" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-1">{barbero.email ?? '—'}</div>
                                {barbero.es_dueno && <Badge variant="secondary" className="mb-2">Dueño</Badge>}
                                {barbero.comision_porcentaje != null && (
                                    <div className="text-sm text-muted-foreground mb-3">Comisión: {barbero.comision_porcentaje}%</div>
                                )}
                                <EntityActions
                                    showRoute={show(barbero.id)}
                                    editRoute={edit(barbero.id)}
                                    deleteRoute={destroy(barbero.id)}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {barberos.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">No hay barberos registrados.</p>
                )}
            </div>
        </AppLayout>
    );
}
