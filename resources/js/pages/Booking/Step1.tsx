import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Barber {
    id: string;
    nombre: string;
    activo: boolean;
}

interface Service {
    id: string;
    nombre: string;
    precio: number;
    duracion_minutos: number;
}

interface Slot {
    inicio: string;
    fin: string;
}

interface Props {
    barbers: Barber[];
    services: Service[];
}

export default function BookingStep1({ barbers, services }: Props) {
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsChecked, setSlotsChecked] = useState(false);
    
    // Client form
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteEmail, setClienteEmail] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');
    
    // States
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
        );
        setSlots([]);
        setSelectedSlot(null);
        setSlotsChecked(false);
    };

    const totalDuration = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + s.duracion_minutos, 0);

    const totalPrice = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + Number(s.precio), 0);

    const checkAvailability = async () => {
        if (!selectedBarber || selectedServices.length === 0 || !selectedDate) return;
        setLoadingSlots(true);
        setSlots([]);
        setSelectedSlot(null);
        setSlotsChecked(false);
        setErrorMessage('');

        const tenant = window.location.pathname.split('/')[1];
        const csrfToken = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) ?? [])[1];

        try {
            const res = await fetch(`/${tenant}/booking/check-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    barber_id: selectedBarber,
                    service_ids: selectedServices,
                    date: selectedDate,
                }),
            });

            const data = await res.json();
            setSlots(data.slots ?? []);
            setSlotsChecked(true);
        } catch (err) {
            setErrorMessage('Error al verificar disponibilidad');
        } finally {
            setLoadingSlots(false);
        }
    };

    const confirmBooking = async () => {
        if (!selectedBarber || !selectedSlot || !clienteNombre || !clienteEmail) {
            setErrorMessage('Por favor completa todos los campos');
            return;
        }

        setConfirmLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const tenant = window.location.pathname.split('/')[1];
        const csrfToken = (document.cookie.match(/XSRF-TOKEN=([^;]+)/) ?? [])[1];

        try {
            const res = await fetch(`/${tenant}/booking/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    barber_id: selectedBarber,
                    service_ids: selectedServices,
                    date: selectedDate,
                    slot_inicio: selectedSlot.inicio,
                    slot_fin: selectedSlot.fin,
                    cliente_nombre: clienteNombre,
                    cliente_email: clienteEmail,
                    cliente_telefono: clienteTelefono,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al confirmar la cita');
            }

            const data = await res.json();
            setSuccessMessage('¡Cita confirmada correctamente! Te hemos enviado un correo de confirmación.');
            // Reset form
            setClienteNombre('');
            setClienteEmail('');
            setClienteTelefono('');
            setSelectedBarber(null);
            setSelectedServices([]);
            setSelectedDate('');
            setSelectedSlot(null);
            setSlots([]);
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Error al confirmar la cita');
        } finally {
            setConfirmLoading(false);
        }
    };

    const canBook = selectedBarber && selectedServices.length > 0 && selectedSlot && clienteNombre && clienteEmail;
    const activeBarbers = barbers.filter(b => b.activo);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title="Reservar cita" />

            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">B</div>
                    <h1 className="text-lg font-semibold">Reservar una cita</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Success message */}
                {successMessage && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Paso 1: barbero */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                            Elige tu barbero
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeBarbers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay barberos disponibles.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {activeBarbers.map(barber => (
                                    <button
                                        key={barber.id}
                                        onClick={() => {
                                            setSelectedBarber(barber.id);
                                            setSlots([]);
                                            setSelectedSlot(null);
                                            setSlotsChecked(false);
                                        }}
                                        className={`rounded-lg border-2 p-4 text-left transition-colors ${
                                            selectedBarber === barber.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold mb-2">
                                            {barber.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-sm font-medium leading-tight">{barber.nombre}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Paso 2: servicios */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                            Elige los servicios
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {services.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay servicios disponibles.</p>
                        ) : (
                            <>
                                {services.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`w-full flex items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
                                            selectedServices.includes(service.id)
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="text-sm font-medium">{service.nombre}</span>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <Badge variant="secondary" className="text-xs">{service.duracion_minutos} min</Badge>
                                            <Badge className="text-xs">${Number(service.precio).toFixed(2)}</Badge>
                                        </div>
                                    </button>
                                ))}
                                {selectedServices.length > 0 && (
                                    <div className="mt-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground flex justify-between">
                                        <span>Total seleccionado</span>
                                        <span className="font-medium text-foreground">{totalDuration} min · ${totalPrice.toFixed(2)}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Paso 3: fecha y horario */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                            Elige la fecha y horario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => {
                                setSelectedDate(e.target.value);
                                setSlots([]);
                                setSelectedSlot(null);
                                setSlotsChecked(false);
                            }}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />

                        <Button
                            type="button"
                            variant="outline"
                            disabled={!selectedBarber || selectedServices.length === 0 || !selectedDate || loadingSlots}
                            onClick={checkAvailability}
                            className="w-full"
                        >
                            {loadingSlots ? 'Verificando disponibilidad...' : 'Ver horarios disponibles'}
                        </Button>

                        {slotsChecked && slots.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-2">
                                No hay horarios disponibles para esta fecha.
                            </p>
                        )}

                        {slots.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {slots.map(slot => (
                                    <button
                                        key={slot.inicio}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`rounded-md border-2 py-2 px-1 text-sm transition-colors ${
                                            selectedSlot?.inicio === slot.inicio
                                                ? 'border-primary bg-primary/10 font-semibold'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        {slot.inicio}
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Paso 4: datos del cliente */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                            Tus datos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="nombre">Nombre completo *</Label>
                            <Input
                                id="nombre"
                                value={clienteNombre}
                                onChange={(e) => setClienteNombre(e.target.value)}
                                placeholder="Tu nombre"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Correo electrónico *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={clienteEmail}
                                onChange={(e) => setClienteEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="telefono">Teléfono (opcional)</Label>
                            <Input
                                id="telefono"
                                type="tel"
                                value={clienteTelefono}
                                onChange={(e) => setClienteTelefono(e.target.value)}
                                placeholder="+57 300 000 0000"
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Botón confirmar */}
                <Button
                    disabled={!canBook || confirmLoading}
                    className="w-full py-6 text-base"
                    onClick={confirmBooking}
                >
                    {confirmLoading ? 'Confirmando cita...' : 'Confirmar reserva'}
                </Button>

            </main>
        </div>
    );
}
