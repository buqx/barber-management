import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Textarea } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BreadcrumbItem, Barberia } from '@/types';

interface Props {
    barberia: Barberia | null;
    barbero?: {
        id: string;
        nombre: string;
    };
    error?: string;
}

export default function ConfiguracionBarberia({ barberia, error }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Configuración', href: '#' },
    ];

    const [activeTab, setActiveTab] = useState('general');

    const form = useForm({
        nombre: barberia?.nombre || '',
        slug: barberia?.slug || '',
        telefono: barberia?.telefono || '',
        direccion: barberia?.direccion || '',
        descripcion: barberia?.descripcion || '',
        facebook_url: barberia?.facebook_url || '',
        instagram_url: barberia?.instagram_url || '',
        horario_atencion: barberia?.horario_atencion || '',
        color_primario: barberia?.color_primario || '#1a1a1a',
        color_secundario: barberia?.color_secundario || '#f5f5f5',
        moneda: barberia?.moneda || 'USD',
        timezone: barberia?.timezone || 'America/Bogota',
        booking_habilitado: barberia?.booking_habilitado ?? true,
        dias_anticipacion: barberia?.dias_anticipacion || 30,
        intervalo_citas: barberia?.intervalo_citas || 30,
        logo: null as File | null,
        banner: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData();

        // Append all fields
        Object.entries(form.data).forEach(([key, value]) => {
            if (key === 'logo' || key === 'banner') {
                if (value) {
                    formData.append(key, value);
                }
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        form.post(route('configuracion.update', { id: barberia?.id }), {
            data: formData,
            encType: 'multipart/form-data',
            onSuccess: () => {
                // Show success message
            },
        });
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('logo', file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('banner', file);
        }
    };

    if (error || !barberia) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Configuración" />
                <div className="p-6">
                    <PageHeader title="Mi Barbería" />
                    <Card>
                        <CardContent className="py-10 text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">Sin barbería asignada</h3>
                            <p className="text-muted-foreground">{error || 'No tienes una barbería asignada como dueño.'}</p>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Configuración - ${barberia.nombre}`} />
            <div className="p-6 space-y-6">
                <PageHeader
                    title={`Configuración - ${barberia.nombre}`}
                    description="Personaliza la apariencia de tu barbería"
                />

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
                        <TabsTrigger value="contacto">Contacto</TabsTrigger>
                        <TabsTrigger value="booking">Booking</TabsTrigger>
                    </TabsList>

                    <form onSubmit={submit}>
                        {/* General */}
                        <TabsContent value="general" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información General</CardTitle>
                                    <CardDescription>Información básica de tu barbería</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">Nombre de la barbería *</Label>
                                            <Input
                                                id="nombre"
                                                value={form.data.nombre}
                                                onChange={e => form.setData('nombre', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="slug">Slug (URL) *</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-sm">/</span>
                                                <Input
                                                    id="slug"
                                                    value={form.data.slug}
                                                    onChange={e => form.setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Tu booking público será: /{form.data.slug}/booking
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="moneda">Moneda</Label>
                                            <Input
                                                id="moneda"
                                                value={form.data.moneda}
                                                onChange={e => form.setData('moneda', e.target.value.toUpperCase())}
                                                placeholder="USD"
                                                maxLength={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Zona Horaria</Label>
                                            <Input
                                                id="timezone"
                                                value={form.data.timezone}
                                                onChange={e => form.setData('timezone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Apariencia */}
                        <TabsContent value="apariencia" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Imágenes</CardTitle>
                                    <CardDescription>Logo y banner de tu barbería</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Logo */}
                                    <div className="space-y-2">
                                        <Label>Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2">
                                                {barberia.logo_url ? (
                                                    <img src={barberia.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-gray-400">{barberia.nombre.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="max-w-xs"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">JPG, PNG o GIF. Max 2MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Banner */}
                                    <div className="space-y-2">
                                        <Label>Banner</Label>
                                        <div className="w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed">
                                            {barberia.banner_url ? (
                                                <img src={barberia.banner_url} alt="Banner" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-muted-foreground">Sin banner</span>
                                            )}
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerChange}
                                            className="max-w-xs"
                                        />
                                        <p className="text-xs text-muted-foreground">Imagen de portada para el booking. JPG, PNG o GIF. Max 5MB.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Colores</CardTitle>
                                    <CardDescription>Personaliza los colores de tu booking</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="color_primario">Color Primario</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={form.data.color_primario}
                                                    onChange={e => form.setData('color_primario', e.target.value)}
                                                    className="w-12 h-10 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    value={form.data.color_primario}
                                                    onChange={e => form.setData('color_primario', e.target.value)}
                                                    placeholder="#1a1a1a"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="color_secundario">Color Secundario</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={form.data.color_secundario}
                                                    onChange={e => form.setData('color_secundario', e.target.value)}
                                                    className="w-12 h-10 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    value={form.data.color_secundario}
                                                    onChange={e => form.setData('color_secundario', e.target.value)}
                                                    placeholder="#f5f5f5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: form.data.color_secundario }}>
                                            <div className="p-2 rounded text-white" style={{ backgroundColor: form.data.color_primario }}>
                                                Vista previa
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Contacto */}
                        <TabsContent value="contacto" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de Contacto</CardTitle>
                                    <CardDescription>Información que verán tus clientes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">Teléfono</Label>
                                            <Input
                                                id="telefono"
                                                value={form.data.telefono}
                                                onChange={e => form.setData('telefono', e.target.value)}
                                                placeholder="+57 300 000 0000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="direccion">Dirección</Label>
                                            <Input
                                                id="direccion"
                                                value={form.data.direccion}
                                                onChange={e => form.setData('direccion', e.target.value)}
                                                placeholder="Dirección de tu barbería"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="descripcion">Descripción</Label>
                                        <Textarea
                                            id="descripcion"
                                            value={form.data.descripcion}
                                            onChange={e => form.setData('descripcion', e.target.value)}
                                            placeholder="Breve descripción de tu barbería"
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Redes Sociales</CardTitle>
                                    <CardDescription>Enlaces a tus redes sociales</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="facebook_url">Facebook</Label>
                                            <Input
                                                id="facebook_url"
                                                type="url"
                                                value={form.data.facebook_url}
                                                onChange={e => form.setData('facebook_url', e.target.value)}
                                                placeholder="https://facebook.com/tu_barberia"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="instagram_url">Instagram</Label>
                                            <Input
                                                id="instagram_url"
                                                type="url"
                                                value={form.data.instagram_url}
                                                onChange={e => form.setData('instagram_url', e.target.value)}
                                                placeholder="https://instagram.com/tu_barberia"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Horario de Atención</CardTitle>
                                    <CardDescription>Horario que verán tus clientes en el booking</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Textarea
                                        value={form.data.horario_atencion}
                                        onChange={e => form.setData('horario_atencion', e.target.value)}
                                        placeholder="Lunes a Viernes: 9:00 AM - 7:00 PM&#10;Sábado: 9:00 AM - 5:00 PM&#10;Domingo: Cerrado"
                                        rows={5}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Booking */}
                        <TabsContent value="booking" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración de Citas</CardTitle>
                                    <CardDescription>Configura cómo tus clientes pueden reservar</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <Label className="font-medium">Habilitar Booking</Label>
                                            <p className="text-sm text-muted-foreground">Permitir que clientes reserven citas en línea</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={form.data.booking_habilitado}
                                            onChange={e => form.setData('booking_habilitado', e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="dias_anticipacion">Días de anticipación</Label>
                                            <Input
                                                id="dias_anticipacion"
                                                type="number"
                                                min={1}
                                                max={365}
                                                value={form.data.dias_anticipacion}
                                                onChange={e => form.setData('dias_anticipacion', parseInt(e.target.value))}
                                            />
                                            <p className="text-xs text-muted-foreground">Cuántos días antes pueden reservar</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="intervalo_citas">Intervalo entre citas (minutos)</Label>
                                            <Input
                                                id="intervalo_citas"
                                                type="number"
                                                min={15}
                                                max={120}
                                                step={15}
                                                value={form.data.intervalo_citas}
                                                onChange={e => form.setData('intervalo_citas', parseInt(e.target.value))}
                                            />
                                            <p className="text-xs text-muted-foreground">Tiempo mínimo entre cada cita</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Vista Previa</CardTitle>
                                    <CardDescription>Ve cómo se verá tu booking público</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <a
                                        href={`/${barberia.slug}/booking`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                                        style={{ backgroundColor: form.data.color_primario }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Abrir Booking en nueva pestaña
                                    </a>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Botón de guardar */}
                        <div className="flex justify-end mt-6">
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Guardando...' : 'Guardar configuración'}
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </div>
        </AppLayout>
    );
}
