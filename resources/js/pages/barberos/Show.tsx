import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import { InfoField, BoolBadge } from '@/components/primitives';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Checkbox,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Separator,
} from '@/components/ui';
import { index, show, edit, destroy, syncServicios } from '@/routes/barberos';
import { store as storeHorario, update as updateHorario, destroy as destroyHorario } from '@/routes/horarios';
import { store as storeBloqueo, destroy as destroyBloqueo } from '@/routes/bloqueos';
import type { Barbero, BloqueoExcepcion, BreadcrumbItem, HorarioBase, Servicio } from '@/types';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Props {
    barbero: Barbero;
    horarios: HorarioBase[];
    bloqueos: BloqueoExcepcion[];
    serviciosDisponibles: Servicio[];
    serviciosAsignados: string[];
}

export default function BarberoShow({ barbero, horarios, bloqueos, serviciosDisponibles, serviciosAsignados }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Barberos', href: index.url() },
        { title: barbero.nombre, href: show.url(barbero.id) },
    ];

    // --- Delete barbero ---
    const deleteForm = useForm();
    function handleDelete() {
        if (confirm(`¿Eliminar al barbero "${barbero.nombre}"?`)) {
            deleteForm.delete(destroy.url(barbero.id));
        }
    }

    // --- Servicios ---
    const serviciosForm = useForm({ servicio_ids: serviciosAsignados as string[] });
    function toggleServicio(id: string) {
        const ids = serviciosForm.data.servicio_ids.includes(id)
            ? serviciosForm.data.servicio_ids.filter((i) => i !== id)
            : [...serviciosForm.data.servicio_ids, id];
        serviciosForm.setData('servicio_ids', ids);
    }
    function saveServicios() {
        serviciosForm.post(syncServicios.url(barbero.id));
    }

    // --- Horarios ---
    const [horarioOpen, setHorarioOpen] = useState(false);
    const [editingHorario, setEditingHorario] = useState<HorarioBase | null>(null);
    const horarioForm = useForm({
        barbero_id: barbero.id,
        dia_semana: '1',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        almuerzo_inicio: '',
        almuerzo_fin: '',
    });

    function openAddHorario() {
        setEditingHorario(null);
        horarioForm.reset();
        horarioForm.setData('barbero_id', barbero.id);
        setHorarioOpen(true);
    }

    function openEditHorario(h: HorarioBase) {
        setEditingHorario(h);
        horarioForm.setData({
            barbero_id: h.barbero_id,
            dia_semana: String(h.dia_semana),
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            almuerzo_inicio: h.almuerzo_inicio ?? '',
            almuerzo_fin: h.almuerzo_fin ?? '',
        });
        setHorarioOpen(true);
    }

    function submitHorario() {
        if (editingHorario) {
            horarioForm.put(updateHorario.url(editingHorario.id), {
                onSuccess: () => setHorarioOpen(false),
            });
        } else {
            horarioForm.post(storeHorario.url(), {
                onSuccess: () => setHorarioOpen(false),
            });
        }
    }

    function handleDeleteHorario(id: string) {
        if (confirm('¿Eliminar este horario?')) {
            router.delete(destroyHorario.url(id));
        }
    }

    // --- Bloqueos ---
    const [bloqueoOpen, setBloqueoOpen] = useState(false);
    const bloqueoForm = useForm({
        barbero_id: barbero.id,
        fecha_inicio: '',
        fecha_fin: '',
        motivo: '',
        todo_el_dia: true as boolean,
    });

    function submitBloqueo() {
        bloqueoForm.post(storeBloqueo.url(), {
            onSuccess: () => {
                setBloqueoOpen(false);
                bloqueoForm.reset();
                bloqueoForm.setData('barbero_id', barbero.id);
            },
        });
    }

    function handleDeleteBloqueo(id: string) {
        if (confirm('¿Eliminar este bloqueo?')) {
            router.delete(destroyBloqueo.url(id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={barbero.nombre} />
            <div className="p-6 max-w-4xl space-y-6">
                <PageHeader title={barbero.nombre} backRoute={index()} />

                {/* Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {barbero.nombre}
                            <BoolBadge value={barbero.activo} trueLabel="Activo" falseLabel="Inactivo" />
                            {barbero.es_dueno && <Badge variant="secondary">Dueño</Badge>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoField label="Nombre" value={barbero.nombre} />
                            <InfoField label="Email" value={barbero.email} />
                            <InfoField label="Comisión" value={barbero.comision_porcentaje != null ? `${barbero.comision_porcentaje}%` : null} />
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button onClick={() => router.visit(edit.url(barbero.id))}>Editar</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteForm.processing}>
                                Eliminar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Servicios asignados */}
                <Card>
                    <CardHeader>
                        <CardTitle>Servicios asignados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {serviciosDisponibles.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No hay servicios disponibles.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {serviciosDisponibles.map((s) => (
                                    <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={serviciosForm.data.servicio_ids.includes(s.id)}
                                            onCheckedChange={() => toggleServicio(s.id)}
                                        />
                                        <span className="text-sm">{s.nombre}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <Button onClick={saveServicios} disabled={serviciosForm.processing}>
                            Guardar servicios
                        </Button>
                    </CardContent>
                </Card>

                {/* Horarios */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Horarios de trabajo</CardTitle>
                        <Button size="sm" onClick={openAddHorario}>Agregar horario</Button>
                    </CardHeader>
                    <CardContent>
                        {horarios.length === 0 ? (
                            <p className="text-muted-foreground text-sm">Sin horarios configurados.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 font-medium">Día</th>
                                        <th className="text-left py-2 font-medium">Inicio</th>
                                        <th className="text-left py-2 font-medium">Fin</th>
                                        <th className="text-left py-2 font-medium">Almuerzo</th>
                                        <th className="py-2" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {horarios.map((h) => (
                                        <tr key={h.id} className="border-b last:border-0">
                                            <td className="py-2">{DIAS[h.dia_semana]}</td>
                                            <td className="py-2">{h.hora_inicio}</td>
                                            <td className="py-2">{h.hora_fin}</td>
                                            <td className="py-2">
                                                {h.almuerzo_inicio && h.almuerzo_fin
                                                    ? `${h.almuerzo_inicio} – ${h.almuerzo_fin}`
                                                    : '—'}
                                            </td>
                                            <td className="py-2">
                                                <div className="flex gap-1 justify-end">
                                                    <Button size="sm" variant="outline" onClick={() => openEditHorario(h)}>
                                                        Editar
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteHorario(h.id)}>
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>

                {/* Bloqueos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Bloqueos / Excepciones</CardTitle>
                        <Button size="sm" onClick={() => setBloqueoOpen(true)}>Agregar bloqueo</Button>
                    </CardHeader>
                    <CardContent>
                        {bloqueos.length === 0 ? (
                            <p className="text-muted-foreground text-sm">Sin bloqueos registrados.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 font-medium">Desde</th>
                                        <th className="text-left py-2 font-medium">Hasta</th>
                                        <th className="text-left py-2 font-medium">Motivo</th>
                                        <th className="text-left py-2 font-medium">Todo el día</th>
                                        <th className="py-2" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {bloqueos.map((b) => (
                                        <tr key={b.id} className="border-b last:border-0">
                                            <td className="py-2">{new Date(b.fecha_inicio).toLocaleDateString('es-CO')}</td>
                                            <td className="py-2">{new Date(b.fecha_fin).toLocaleDateString('es-CO')}</td>
                                            <td className="py-2">{b.motivo ?? '—'}</td>
                                            <td className="py-2">{b.todo_el_dia ? 'Sí' : 'No'}</td>
                                            <td className="py-2 text-right">
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteBloqueo(b.id)}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>

                {/* Horario Dialog */}
                <Dialog open={horarioOpen} onOpenChange={setHorarioOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingHorario ? 'Editar horario' : 'Agregar horario'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Día de la semana</Label>
                                <select
                                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={horarioForm.data.dia_semana}
                                    onChange={(e) => horarioForm.setData('dia_semana', e.target.value)}
                                >
                                    {DIAS.map((d, i) => (
                                        <option key={i} value={i}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Hora inicio</Label>
                                    <Input
                                        type="time"
                                        value={horarioForm.data.hora_inicio}
                                        onChange={(e) => horarioForm.setData('hora_inicio', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Hora fin</Label>
                                    <Input
                                        type="time"
                                        value={horarioForm.data.hora_fin}
                                        onChange={(e) => horarioForm.setData('hora_fin', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Almuerzo inicio (opcional)</Label>
                                    <Input
                                        type="time"
                                        value={horarioForm.data.almuerzo_inicio}
                                        onChange={(e) => horarioForm.setData('almuerzo_inicio', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Almuerzo fin (opcional)</Label>
                                    <Input
                                        type="time"
                                        value={horarioForm.data.almuerzo_fin}
                                        onChange={(e) => horarioForm.setData('almuerzo_fin', e.target.value)}
                                    />
                                </div>
                            </div>
                            {horarioForm.errors.hora_inicio && (
                                <p className="text-destructive text-sm">{horarioForm.errors.hora_inicio}</p>
                            )}
                            {horarioForm.errors.hora_fin && (
                                <p className="text-destructive text-sm">{horarioForm.errors.hora_fin}</p>
                            )}
                            <Button onClick={submitHorario} disabled={horarioForm.processing} className="w-full">
                                {editingHorario ? 'Guardar cambios' : 'Agregar'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Bloqueo Dialog */}
                <Dialog open={bloqueoOpen} onOpenChange={setBloqueoOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar bloqueo / excepción</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Fecha inicio</Label>
                                    <Input
                                        type="datetime-local"
                                        value={bloqueoForm.data.fecha_inicio}
                                        onChange={(e) => bloqueoForm.setData('fecha_inicio', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Fecha fin</Label>
                                    <Input
                                        type="datetime-local"
                                        value={bloqueoForm.data.fecha_fin}
                                        onChange={(e) => bloqueoForm.setData('fecha_fin', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Motivo (opcional)</Label>
                                <Input
                                    value={bloqueoForm.data.motivo}
                                    onChange={(e) => bloqueoForm.setData('motivo', e.target.value)}
                                    placeholder="Vacaciones, enfermedad…"
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={bloqueoForm.data.todo_el_dia}
                                    onCheckedChange={(v) => bloqueoForm.setData('todo_el_dia', !!v)}
                                />
                                <span className="text-sm">Bloquear todo el día</span>
                            </label>
                            {bloqueoForm.errors.fecha_inicio && (
                                <p className="text-destructive text-sm">{bloqueoForm.errors.fecha_inicio}</p>
                            )}
                            {bloqueoForm.errors.fecha_fin && (
                                <p className="text-destructive text-sm">{bloqueoForm.errors.fecha_fin}</p>
                            )}
                            <Button onClick={submitBloqueo} disabled={bloqueoForm.processing} className="w-full">
                                Agregar bloqueo
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

