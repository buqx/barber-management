import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Checkbox } from '@/components/ui';
import { index, create, store } from '@/routes/barberos';
import type { Barberia, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barberos', href: index.url() },
    { title: 'Nuevo', href: create.url() },
];

interface Props {
    barberias: Barberia[];
}

export default function BarberoCreate({ barberias }: Props) {
    const { auth } = usePage().props as {
        auth: {
            is_global_admin?: boolean;
            is_owner?: boolean;
            barberia_id?: string | null;
        }
    };

    const isOwner = auth?.is_owner ?? false;
    const isGlobalAdmin = auth?.is_global_admin ?? false;

    // Si es owner, pre-seleccionar su barbería
    const initialBarberiaId = isOwner && barberias.length === 1 ? barberias[0].id : '';

    const form = useForm({
        nombre: '',
        email: '',
        cedula: '',
        foto: null as File | null,
        barberia_id: initialBarberiaId,
        es_dueno: false,
        comision_porcentaje: '',
        activo: true,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!form.data.foto) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(form.data.foto);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.data.foto]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(store.url(), { forceFormData: true });
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
                            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={previewUrl ?? undefined} alt={form.data.nombre || 'Foto del barbero'} />
                                    <AvatarFallback>{(form.data.nombre || 'B').slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="foto">Foto de perfil</Label>
                                    <Input
                                        id="foto"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={e => form.setData('foto', e.target.files?.[0] ?? null)}
                                    />
                                    {form.errors.foto && <p className="text-sm text-destructive">{form.errors.foto}</p>}
                                </div>
                            </div>
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
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    required
                                />
                                {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cedula">Cedula *</Label>
                                <Input
                                    id="cedula"
                                    value={form.data.cedula}
                                    onChange={e => form.setData('cedula', e.target.value)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">La contrasena inicial del usuario sera esta cedula.</p>
                                {form.errors.cedula && <p className="text-sm text-destructive">{form.errors.cedula}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="barberia_id">Barberia *</Label>
                                <select
                                    id="barberia_id"
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    value={form.data.barberia_id}
                                    onChange={e => form.setData('barberia_id', e.target.value)}
                                    required
                                    disabled={isOwner}
                                >
                                    <option value="" disabled={!isOwner}>Selecciona una barberia</option>
                                    {barberias.map((barberia) => (
                                        <option key={barberia.id} value={barberia.id}>
                                            {barberia.nombre}
                                        </option>
                                    ))}
                                </select>
                                {isOwner && (
                                    <p className="text-sm text-muted-foreground">Solo puedes crear barberos para tu barberia.</p>
                                )}
                                {form.errors.barberia_id && <p className="text-sm text-destructive">{form.errors.barberia_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="comision_porcentaje">Comision (%)</Label>
                                <Input
                                    id="comision_porcentaje"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.data.comision_porcentaje}
                                    onChange={e => form.setData('comision_porcentaje', e.target.value)}
                                />
                            </div>
                            {isGlobalAdmin && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="es_dueno"
                                            checked={form.data.es_dueno}
                                            onCheckedChange={v => form.setData('es_dueno', Boolean(v))}
                                        />
                                        <Label htmlFor="es_dueno">Es dueno</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Si activas "Es dueno", el usuario del barbero tendra permisos administrativos.</p>
                                </>
                            )}
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
