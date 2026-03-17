import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Checkbox } from '@/components/ui';
import { index, show, edit, update } from '@/routes/barberos';
import type { BreadcrumbItem, Barbero } from '@/types';

interface Props {
    barbero: Barbero;
}

export default function BarberoEdit({ barbero }: Props) {
    const { auth } = usePage().props as {
        auth: {
            is_global_admin?: boolean;
            is_owner?: boolean;
            barberia_id?: string | null;
        }
    };

    const isGlobalAdmin = auth?.is_global_admin ?? false;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barberos', href: index.url() },
        { title: barbero.nombre, href: show.url(barbero.id) },
        { title: 'Editar', href: edit.url(barbero.id) },
    ];

    const form = useForm({
        nombre: barbero.nombre,
        email: barbero.email ?? '',
        cedula: barbero.cedula ?? '',
        foto: null as File | null,
        barberia_id: barbero.barberia_id,
        es_dueno: barbero.es_dueno,
        comision_porcentaje: barbero.comision_porcentaje?.toString() ?? '',
        activo: barbero.activo,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(barbero.foto_url);

    useEffect(() => {
        if (!form.data.foto) {
            setPreviewUrl(barbero.foto_url);
            return;
        }

        const objectUrl = URL.createObjectURL(form.data.foto);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [barbero.foto_url, form.data.foto]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.put(update.url(barbero.id), { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${barbero.nombre}`} />
            <div className="p-6 max-w-2xl">
                <PageHeader title={`Editar ${barbero.nombre}`} backRoute={show(barbero.id)} />
                <Card>
                    <CardHeader>
                        <CardTitle>Datos del barbero</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={previewUrl ?? undefined} alt={barbero.nombre} />
                                    <AvatarFallback>{barbero.nombre.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                                <Label htmlFor="cedula">Cédula *</Label>
                                <Input
                                    id="cedula"
                                    value={form.data.cedula}
                                    onChange={e => form.setData('cedula', e.target.value)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">La contraseña por defecto sólo se usa al crear el usuario inicial.</p>
                                {form.errors.cedula && <p className="text-sm text-destructive">{form.errors.cedula}</p>}
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
                            {isGlobalAdmin && (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="es_dueno"
                                        checked={form.data.es_dueno}
                                        onCheckedChange={v => form.setData('es_dueno', Boolean(v))}
                                    />
                                    <Label htmlFor="es_dueno">Es dueño</Label>
                                </div>
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
                                {form.processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
