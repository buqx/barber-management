import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Checkbox } from '@/components/ui';
import type { BreadcrumbItem, Barbero, Cliente, Servicio } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración', href: '/configuracion/mi-barberia' },
    { title: 'Turnos Fijos', href: '/turnos-fijos' },
];

interface TurnoFijo {
    id: string;
    barbero_id: string;
    cliente_id: string;
    dia_semana: number;
    hora_inicio: string;
    activo: boolean;
    cliente?: {
        id: string;
        nombre: string;
        email: string;
    };
    servicios?: Array<{
        id: string;
        nombre: string;
        duracion_minutos: number;
    }>;
    duracion_total?: number;
    dia_semana_nombre?: string;
}

interface Props {
    turnosFijos: TurnoFijo[];
    barberos: Barbero[];
    barberoId: string;
    clientes: Cliente[];
    servicios: Servicio[];
}

const DIAS_SEMANA = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
];

export default function TurnosFijos({ turnosFijos, barberos, barberoId, clientes, servicios }: Props) {
    const { auth } = usePage().props as {
        auth: {
            is_global_admin?: boolean;
            is_owner?: boolean;
            barberia_id?: string | null;
        }
    };

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedBarberoId, setSelectedBarberoId] = useState(barberoId || barberos[0]?.id || '');

    const form = useForm({
        barbero_id: selectedBarberoId,
        cliente_id: '',
        dia_semana: 1,
        hora_inicio: '09:00',
        servicios: [] as string[],
        activo: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingId) {
            form.put(`/turnos-fijos/${editingId}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingId(null);
                    form.reset();
                },
            });
        } else {
            form.post('/turnos-fijos', {
                onSuccess: () => {
                    setShowForm(false);
                    form.reset();
                },
            });
        }
    }

    function handleEdit(turno: TurnoFijo) {
        setEditingId(turno.id);
        form.setData({
            barbero_id: turno.barbero_id,
            cliente_id: turno.cliente_id,
            dia_semana: turno.dia_semana,
            hora_inicio: turno.hora_inicio,
            servicios: turno.servicios?.map(s => s.id) || [],
            activo: turno.activo,
        });
        setShowForm(true);
    }

    function handleDelete(id: string) {
        if (confirm('¿Estás seguro de eliminar este turno fijo?')) {
            router.delete(`/turnos-fijos/${id}`);
        }
    }

    function handleCancel() {
        setShowForm(false);
        setEditingId(null);
        form.reset();
    }

    // Filtrar turnos por barbero seleccionado
    const filteredTurnos = turnosFijos.filter(t => t.barbero_id === selectedBarberoId);

    // Calcular duración de servicios seleccionados
    const selectedServiciosDuration = servicios
        .filter(s => form.data.servicios.includes(s.id))
        .reduce((sum, s) => sum + (s.duracion_minutos || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Turnos Fijos" />
            <div className="p-6 max-w-4xl mx-auto">
                <PageHeader
                    title="Turnos Fijos"
                    description="Gestiona los horarios fijos de clientes recurrentes"
                />

                {/* Selector de barbero */}
                {barberos.length > 1 && (
                    <div className="mb-6">
                        <Label htmlFor="barbero_select">Barbero</Label>
                        <select
                            id="barbero_select"
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm mt-1"
                            value={selectedBarberoId}
                            onChange={e => {
                                setSelectedBarberoId(e.target.value);
                                setShowForm(false);
                            }}
                        >
                            {barberos.map(b => (
                                <option key={b.id} value={b.id}>{b.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Lista de turnos fijos */}
                <div className="grid gap-4 mb-6">
                    {filteredTurnos.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No hay turnos fijos para este barbero.
                        </p>
                    ) : (
                        filteredTurnos.map(turno => (
                            <Card key={turno.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">
                                            {turno.cliente?.nombre || 'Cliente'}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            {!turno.activo && (
                                                <span className="text-xs bg-muted px-2 py-1 rounded">Inactivo</span>
                                            )}
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(turno)}>
                                                Editar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(turno.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">
                                        <div>{DIAS_SEMANA.find(d => d.value === turno.dia_semana)?.label} a las {turno.hora_inicio}</div>
                                        <div className="mt-1">
                                            Servicios: {turno.servicios?.map(s => s.nombre).join(', ') || 'Sin servicios'}
                                            {turno.duracion_total && ` (${turno.duracion_total} min)`}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Botón para agregar */}
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="w-full">
                        + Agregar Turno Fijo
                    </Button>
                )}

                {/* Formulario */}
                {showForm && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>{editingId ? 'Editar Turno Fijo' : 'Nuevo Turno Fijo'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                {barberos.length > 1 && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="barbero_id">Barbero</Label>
                                        <select
                                            id="barbero_id"
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.data.barbero_id}
                                            onChange={e => form.setData('barbero_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona un barbero</option>
                                            {barberos.map(b => (
                                                <option key={b.id} value={b.id}>{b.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="cliente_id">Cliente *</Label>
                                    <select
                                        id="cliente_id"
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={form.data.cliente_id}
                                        onChange={e => form.setData('cliente_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona un cliente</option>
                                        {clientes.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="dia_semana">Día de la semana *</Label>
                                        <select
                                            id="dia_semana"
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                            value={form.data.dia_semana}
                                            onChange={e => form.setData('dia_semana', parseInt(e.target.value))}
                                            required
                                        >
                                            {DIAS_SEMANA.map(d => (
                                                <option key={d.value} value={d.value}>{d.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="hora_inicio">Hora de inicio *</Label>
                                        <Input
                                            id="hora_inicio"
                                            type="time"
                                            value={form.data.hora_inicio}
                                            onChange={e => form.setData('hora_inicio', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Servicios *</Label>
                                    <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                                        {servicios.map(s => (
                                            <div key={s.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`servicio_${s.id}`}
                                                    checked={form.data.servicios.includes(s.id)}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            form.setData('servicios', [...form.data.servicios, s.id]);
                                                        } else {
                                                            form.setData('servicios', form.data.servicios.filter(id => id !== s.id));
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`servicio_${s.id}`} className="text-sm font-normal">
                                                    {s.nombre} ({s.duracion_minutos} min)
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {form.data.servicios.length > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Duración total: {selectedServiciosDuration} minutos
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="activo"
                                        checked={form.data.activo}
                                        onCheckedChange={v => form.setData('activo', Boolean(v))}
                                    />
                                    <Label htmlFor="activo">Activo</Label>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    Los turnos fijos bloquean automáticamente esos horarios en el booking público.
                                </p>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={form.processing}>
                                        {form.processing ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
