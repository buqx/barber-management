import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/navigation';
import {
    Badge,
    Button,
    Card, CardContent, CardHeader, CardTitle,
    Checkbox,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
    Input,
    Label,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Plus, User } from 'lucide-react';
import { index as agendaIndex, checkDisponibilidad as checkDispoUrl, store as storeUrl, updateEstado as updateEstadoUrl } from '@/routes/agenda';
import type { BreadcrumbItem, Barbero, Cita, HorarioBase, Servicio } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Agenda', href: agendaIndex.url() },
];

const estadoBadgeVariant: Record<Cita['estado'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendiente: 'outline',
    confirmada: 'default',
    completada: 'secondary',
    cancelada: 'destructive',
};

interface Slot {
    inicio: string;
    fin: string;
}

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
}

interface Props {
    barbero: (Barbero & { servicios: Servicio[] }) | null;
    barberos: Barbero[];
    horarios: HorarioBase[];
    citas: Cita[];
    citasPendientes: Cita[];
    turnosFijos: TurnoFijo[];
    servicios: Servicio[];
    selectedDate: string;
    isMiAgenda: boolean;
}

function minutesBetween(from: string, to: string): number {
    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = to.split(':').map(Number);
    return (th * 60 + tm) - (fh * 60 + fm);
}

function formatDateDisplay(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function AgendaIndex({ barbero, barberos, horarios, citas, citasPendientes, turnosFijos, servicios, selectedDate, isMiAgenda }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogStep, setDialogStep] = useState<1 | 2>(1);
    const [dialogDate, setDialogDate] = useState(selectedDate);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsChecked, setSlotsChecked] = useState(false);
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteEmail, setClienteEmail] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // — Stats -----------------------------------------------------------------
    const minutosOcupados = citas.reduce((sum, c) => {
        const ini = new Date(c.inicio_at).getTime();
        const fin = new Date(c.fin_at).getTime();
        return sum + Math.round((fin - ini) / 60000);
    }, 0);

    const totalMinutosHorario = horarios.reduce((sum, h) => {
        const work = minutesBetween(h.hora_inicio, h.hora_fin);
        const lunch = h.almuerzo_inicio && h.almuerzo_fin
            ? minutesBetween(h.almuerzo_inicio, h.almuerzo_fin)
            : 0;
        return sum + work - lunch;
    }, 0);

    const minutosLibres = Math.max(0, totalMinutosHorario - minutosOcupados);

    // — Navigation ------------------------------------------------------------
    const navigate = (direction: -1 | 1) => {
        const newDate = addDays(selectedDate, direction);
        router.visit(agendaIndex.url({ query: { fecha: newDate, ...(barbero ? { barbero_id: barbero.id } : {}) } }), {
            replace: true,
            preserveState: false,
        });
    };

    const selectBarbero = (id: string) => {
        router.visit(agendaIndex.url({ query: { barbero_id: id, fecha: selectedDate } }), {
            replace: true,
            preserveState: false,
        });
    };

    // — Inline status change --------------------------------------------------
    const changeEstado = (citaId: string, newEstado: string) => {
        router.patch(updateEstadoUrl(citaId).url, { estado: newEstado }, {
            onSuccess: () => {
                router.reload({ only: ['citasPendientes'] });
            }
        });
    };

    // Wrapper para botones de confirmar/rechazar
    const updateEstado = (citaId: string, newEstado: string) => {
        changeEstado(citaId, newEstado);
    };

    // — Slot availability check -----------------------------------------------
    const toggleService = (id: string) => {
        setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
        setSlots([]);
        setSelectedSlot(null);
        setSlotsChecked(false);
    };

    const getCsrf = () => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    const checkAvailability = async () => {
        if (!barbero || selectedServices.length === 0 || !dialogDate) return;
        setLoadingSlots(true);
        setSlots([]);
        setSelectedSlot(null);
        setSlotsChecked(false);
        setErrorMsg('');

        try {
            const res = await fetch(checkDispoUrl.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    barbero_id: barbero.id,
                    service_ids: selectedServices,
                    fecha: dialogDate,
                }),
            });
            const data = await res.json();
            setSlots(data.slots ?? []);
            setSlotsChecked(true);
            if ((data.slots ?? []).length > 0) setDialogStep(2);
        } catch {
            setErrorMsg('Error al verificar disponibilidad');
        } finally {
            setLoadingSlots(false);
        }
    };

    const submitCita = async () => {
        if (!barbero || !selectedSlot || !clienteNombre || !clienteEmail) {
            setErrorMsg('Completa todos los campos obligatorios');
            return;
        }
        setSubmitting(true);
        setErrorMsg('');

        try {
            const res = await fetch(storeUrl.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    barbero_id: barbero.id,
                    service_ids: selectedServices,
                    fecha: dialogDate,
                    slot_inicio: selectedSlot.inicio,
                    slot_fin: selectedSlot.fin,
                    cliente_nombre: clienteNombre,
                    cliente_email: clienteEmail,
                    cliente_telefono: clienteTelefono || undefined,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message ?? 'Error al agendar la cita');
            }

            // Reload agenda page to show new appointment
            setDialogOpen(false);
            resetDialog();
            router.visit(agendaIndex.url({ query: { fecha: dialogDate, barbero_id: barbero.id } }), {
                replace: true,
                preserveState: false,
            });
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Error al agendar la cita');
        } finally {
            setSubmitting(false);
        }
    };

    const resetDialog = () => {
        setDialogStep(1);
        setDialogDate(selectedDate);
        setSelectedServices([]);
        setSlots([]);
        setSelectedSlot(null);
        setSlotsChecked(false);
        setClienteNombre('');
        setClienteEmail('');
        setClienteTelefono('');
        setErrorMsg('');
    };

    // -------------------------------------------------------------------------

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={barbero ? `Agenda — ${barbero.nombre}` : 'Agenda'} />
            <div className="p-6 space-y-6">

                {/* Header + date nav */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <PageHeader
                        title={barbero ? (isMiAgenda ? 'Mi Agenda' : `Agenda · ${barbero.nombre}`) : 'Agenda'}
                        description={barbero ? 'Horario, citas y disponibilidad del día' : 'Selecciona un barbero para ver su agenda'}
                    />

                    {barbero && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium min-w-[180px] text-center capitalize">
                                {formatDateDisplay(selectedDate)}
                            </span>
                            <Button variant="outline" size="icon" onClick={() => navigate(1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Citas Pendientes - Todas las citas pendientes sin importar la fecha */}
                {citasPendientes.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Citas Pendientes por Confirmar ({citasPendientes.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {citasPendientes.map((cita) => (
                                    <div
                                        key={cita.id}
                                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{cita.cliente?.nombre || 'Cliente sin nombre'}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(cita.inicio_at).toLocaleDateString('es-CO', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                {cita.barbero?.nombre && ` · ${cita.barbero.nombre}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() => updateEstado(cita.id, 'cancelada')}
                                            >
                                                Rechazar
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => updateEstado(cita.id, 'confirmada')}
                                            >
                                                Confirmar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No barbero found → selector */}
                {!barbero && (
                    <div>
                        {barberos.length === 0 ? (
                            <p className="text-muted-foreground text-center py-12">No hay barberos activos.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {barberos.map((b) => (
                                    <Card
                                        key={b.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => selectBarbero(b.id)}
                                    >
                                        <CardContent className="flex items-center gap-3 py-4">
                                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                                {b.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{b.nombre}</p>
                                                {b.email && <p className="text-xs text-muted-foreground">{b.email}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Barbero selected view */}
                {barbero && (
                    <div className="space-y-6">

                        {/* Stats bar */}
                        <div className="grid grid-cols-3 gap-3">
                            <Card>
                                <CardContent className="flex flex-col items-center py-4 gap-1">
                                    <span className="text-2xl font-bold">{citas.length}</span>
                                    <span className="text-xs text-muted-foreground">Citas del día</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center py-4 gap-1">
                                    <span className="text-2xl font-bold">{minutosOcupados}</span>
                                    <span className="text-xs text-muted-foreground">Min. ocupados</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center py-4 gap-1">
                                    <span className="text-2xl font-bold">{minutosLibres}</span>
                                    <span className="text-xs text-muted-foreground">Min. libres</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Work schedule */}
                        {horarios.length > 0 && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Horario laboral
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {horarios.map((h) => (
                                            <div key={h.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{h.hora_inicio} - {h.hora_fin}</span>
                                                {h.almuerzo_inicio && (
                                                    <span className="text-xs">(almuerzo {h.almuerzo_inicio}-{h.almuerzo_fin})</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Fixed schedules (Turnos Fijos) */}
                        {turnosFijos.length > 0 && (
                            <Card className="border-amber-200 bg-amber-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                                        <Clock className="h-4 w-4" />
                                        Turnos fijos del día
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        {turnosFijos.filter(tf => tf.activo).map((tf) => (
                                            <div key={tf.id} className="flex items-center justify-between text-sm bg-white rounded border p-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-amber-600" />
                                                    <span className="font-mono font-medium">{tf.hora_inicio}</span>
                                                    <span className="text-muted-foreground">
                                                        - {tf.cliente?.nombre || 'Cliente'}
                                                        {tf.servicios?.length ? ` (${tf.servicios.map(s => s.nombre).join(', ')})` : ''}
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className="text-xs">Fijo</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Citas list + Nueva cita button */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">Citas del día</h2>
                            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetDialog(); }}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-1">
                                        <Plus className="h-4 w-4" />
                                        Nueva cita
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {dialogStep === 1 ? 'Seleccionar servicios y horario' : 'Datos del cliente'}
                                        </DialogTitle>
                                    </DialogHeader>

                                    {errorMsg && (
                                        <div className="rounded bg-red-50 border border-red-200 text-red-800 text-sm p-3">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Step 1: services + date + slots */}
                                    {dialogStep === 1 && (
                                        <div className="space-y-4">
                                            {/* Date */}
                                            <div className="space-y-1">
                                                <Label htmlFor="dialogDate">Fecha</Label>
                                                <Input
                                                    id="dialogDate"
                                                    type="date"
                                                    value={dialogDate}
                                                    onChange={(e) => {
                                                        setDialogDate(e.target.value);
                                                        setSlots([]);
                                                        setSelectedSlot(null);
                                                        setSlotsChecked(false);
                                                    }}
                                                />
                                            </div>

                                            {/* Services */}
                                            <div className="space-y-2">
                                                <Label>Servicios</Label>
                                                <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
                                                    {servicios.map((s) => (
                                                        <div key={s.id} className="flex items-center justify-between gap-2 rounded border p-2">
                                                            <div className="flex items-center gap-2">
                                                                <Checkbox
                                                                    id={`svc-${s.id}`}
                                                                    checked={selectedServices.includes(s.id)}
                                                                    onCheckedChange={() => toggleService(s.id)}
                                                                />
                                                                <Label htmlFor={`svc-${s.id}`} className="cursor-pointer font-normal">
                                                                    {s.nombre}
                                                                </Label>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {s.duracion_minutos} min · ${Number(s.precio).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Selected summary */}
                                            {selectedServices.length > 0 && (
                                                <div className="text-sm text-muted-foreground">
                                                    {selectedServices.length} servicio(s) · {servicios.filter(s => selectedServices.includes(s.id)).reduce((a, s) => a + s.duracion_minutos, 0)} min
                                                </div>
                                            )}

                                            {/* Check availability */}
                                            <Button
                                                onClick={checkAvailability}
                                                disabled={loadingSlots || selectedServices.length === 0 || !dialogDate}
                                                className="w-full"
                                                variant="outline"
                                            >
                                                {loadingSlots ? 'Verificando...' : 'Ver horarios disponibles'}
                                            </Button>

                                            {/* Slots */}
                                            {slotsChecked && (
                                                <div className="space-y-2">
                                                    {slots.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground text-center py-2">No hay horarios disponibles para esta fecha.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {slots.map((slot, i) => (
                                                                <button
                                                                    key={i}
                                                                    className={`rounded border p-2 text-xs font-medium transition-colors ${
                                                                        selectedSlot?.inicio === slot.inicio
                                                                            ? 'bg-primary text-primary-foreground border-primary'
                                                                            : 'hover:bg-accent'
                                                                    }`}
                                                                    onClick={() => { setSelectedSlot(slot); setDialogStep(2); }}
                                                                >
                                                                    {slot.inicio}–{slot.fin}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Step 2: client data */}
                                    {dialogStep === 2 && selectedSlot && (
                                        <div className="space-y-4">
                                            <div className="rounded bg-muted px-3 py-2 text-sm">
                                                Horario seleccionado: <strong>{selectedSlot.inicio} – {selectedSlot.fin}</strong>
                                                {' · '} {dialogDate}
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="cn">Nombre del cliente *</Label>
                                                <Input
                                                    id="cn"
                                                    placeholder="Nombre completo"
                                                    value={clienteNombre}
                                                    onChange={(e) => setClienteNombre(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="ce">Email *</Label>
                                                <Input
                                                    id="ce"
                                                    type="email"
                                                    placeholder="correo@ejemplo.com"
                                                    value={clienteEmail}
                                                    onChange={(e) => setClienteEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="ct">Teléfono</Label>
                                                <Input
                                                    id="ct"
                                                    placeholder="3001234567"
                                                    value={clienteTelefono}
                                                    onChange={(e) => setClienteTelefono(e.target.value)}
                                                />
                                            </div>

                                            <DialogFooter className="flex gap-2 pt-2">
                                                <Button variant="outline" onClick={() => setDialogStep(1)}>
                                                    Atrás
                                                </Button>
                                                <Button
                                                    onClick={submitCita}
                                                    disabled={submitting || !clienteNombre || !clienteEmail}
                                                >
                                                    {submitting ? 'Agendando...' : 'Confirmar cita'}
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Cita cards */}
                        {citas.length === 0 ? (
                            <Card>
                                <CardContent className="text-center text-muted-foreground py-12">
                                    No hay citas para este día.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {citas.map((cita) => (
                                    <Card key={cita.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-sm font-mono text-muted-foreground min-w-[110px]">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatTime(cita.inicio_at)} – {formatTime(cita.fin_at)}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-sm font-medium">
                                                            {cita.cliente?.nombre ?? '—'}
                                                        </span>
                                                    </div>
                                                    {cita.cliente?.email && (
                                                        <span className="text-xs text-muted-foreground pl-5">{cita.cliente.email}</span>
                                                    )}
                                                    {cita.cliente?.telefono && (
                                                        <span className="text-xs text-muted-foreground pl-5">{cita.cliente.telefono}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-start sm:self-center">
                                                {cita.total_pagado != null && cita.total_pagado > 0 && (
                                                    <span className="text-sm font-medium">${Number(cita.total_pagado).toLocaleString()}</span>
                                                )}
                                                <Select
                                                    value={cita.estado}
                                                    onValueChange={(val) => changeEstado(cita.id, val)}
                                                >
                                                    <SelectTrigger className="w-36 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                                        <SelectItem value="confirmada">Confirmada</SelectItem>
                                                        <SelectItem value="completada">Completada</SelectItem>
                                                        <SelectItem value="cancelada">Cancelada</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
