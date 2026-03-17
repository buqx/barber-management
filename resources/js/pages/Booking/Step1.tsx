import { useState, useEffect, useMemo } from 'react';
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
    foto_url?: string | null;
}

interface Service {
    id: string;
    nombre: string;
    precio: number;
    duracion_minutos: number;
}

interface Barberia {
    id: string;
    nombre: string;
    slug: string;
    logo_url: string | null;
    banner_url: string | null;
    color_primario: string;
    color_secundario: string;
    descripcion: string | null;
    telefono: string | null;
    direccion: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    horario_atencion: string | null;
    dias_anticipacion: number;
    intervalo_citas: number;
    moneda: string;
}

interface Slot {
    inicio: string;
    fin: string;
}

interface Props {
    barbers: Barber[];
    services: Service[];
    barberia?: Barberia | null;
    bookingCerrado?: boolean;
}

export default function BookingStep1({ barbers, services, barberia, bookingCerrado = false }: Props) {
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

    // Dynamic colors from barberia
    const primaryColor = barberia?.color_primario || '#1a1a1a';
    const secondaryColor = barberia?.color_secundario || '#f5f5f5';

    // Calculate min and max date for booking
    const dateConstraints = useMemo(() => {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + (barberia?.dias_anticipacion || 30));
        const maxDateStr = maxDate.toISOString().split('T')[0];
        return { minDate, maxDate: maxDateStr };
    }, [barberia?.dias_anticipacion]);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
        );
        setSlots([]);
        setSelectedSlot(null);
        setSlotsChecked(false);
    };

    const selectedBarberData = barbers.find(b => b.id === selectedBarber);

    const totalDuration = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + s.duracion_minutos, 0);

    const totalPrice = services
        .filter(s => selectedServices.includes(s.id))
        .reduce((acc, s) => acc + Number(s.precio), 0);

    const currencySymbol = barberia?.moneda === 'USD' ? '$' : barberia?.moneda === 'EUR' ? '€' : '$';

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

    // Booking closed state
    if (bookingCerrado || !barberia) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Citas no disponibles</h1>
                    <p className="text-gray-600">En este momento no es posible reservar citas en {barberia?.nombre || 'esta barbería'}.</p>
                    {barberia?.telefono && (
                        <p className="mt-4 text-gray-700">
                            Puedes contactarlos al: <a href={`tel:${barberia.telefono}`} className="font-semibold text-blue-600">{barberia.telefono}</a>
                        </p>
                    )}
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: secondaryColor }}>
            <Head title={`Reservar en ${barberia.nombre}`} />

            {/* Banner */}
            {barberia.banner_url && (
                <div className="h-48 md:h-64 w-full relative">
                    <img
                        src={barberia.banner_url}
                        alt={barberia.nombre}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}

            {/* Header */}
            <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    {barberia.logo_url ? (
                        <img
                            src={barberia.logo_url}
                            alt={barberia.nombre}
                            className="h-12 w-12 rounded-full object-cover border-2"
                            style={{ borderColor: primaryColor }}
                        />
                    ) : (
                        <div
                            className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {barberia.nombre.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-semibold truncate">{barberia.nombre}</h1>
                        {barberia.direccion && (
                            <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {barberia.direccion}
                            </p>
                        )}
                    </div>
                    {barberia.telefono && (
                        <a
                            href={`tel:${barberia.telefono}`}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </a>
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-4 md:space-y-6">

                {/* Descripción */}
                {barberia.descripcion && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-700 text-sm">{barberia.descripcion}</p>
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-medium">¡Reserva confirmada!</p>
                            <p className="text-green-700 mt-1">{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 text-sm flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {/* Paso 1: barbero */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r" style={{ backgroundColor: `${primaryColor}10` }}>
                        <CardTitle className="text-base flex items-center gap-2">
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                1
                            </span>
                            Elige tu barbero
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {activeBarbers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No hay barberos disponibles.</p>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {activeBarbers.map(barber => (
                                    <button
                                        key={barber.id}
                                        onClick={() => {
                                            setSelectedBarber(barber.id);
                                            setSlots([]);
                                            setSelectedSlot(null);
                                            setSlotsChecked(false);
                                        }}
                                        className={`rounded-xl border-2 p-3 text-center transition-all hover:scale-105 ${
                                            selectedBarber === barber.id
                                                ? 'ring-2 ring-offset-2'
                                                : ''
                                        }`}
                                        style={{
                                            borderColor: selectedBarber === barber.id ? primaryColor : 'transparent',
                                            backgroundColor: selectedBarber === barber.id ? `${primaryColor}10` : '#f9fafb',
                                            ringColor: primaryColor
                                        }}
                                    >
                                        <div
                                            className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {barber.foto_url ? (
                                                <img src={barber.foto_url} alt={barber.nombre} className="h-12 w-12 rounded-full object-cover" />
                                            ) : (
                                                barber.nombre.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <p className="text-xs font-medium truncate">{barber.nombre}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Paso 2: servicios */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r" style={{ backgroundColor: `${primaryColor}10` }}>
                        <CardTitle className="text-base flex items-center gap-2">
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                2
                            </span>
                            Elige los servicios
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                        {services.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No hay servicios disponibles.</p>
                        ) : (
                            <>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {services.map(service => (
                                        <button
                                            key={service.id}
                                            onClick={() => toggleService(service.id)}
                                            className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.01] ${
                                                selectedServices.includes(service.id) ? 'ring-2 ring-offset-1' : ''
                                            }`}
                                            style={{
                                                borderColor: selectedServices.includes(service.id) ? primaryColor : '#e5e7eb',
                                                backgroundColor: selectedServices.includes(service.id) ? `${primaryColor}05` : 'white',
                                                ringColor: primaryColor
                                            }}
                                        >
                                            <span className="font-medium text-sm">{service.nombre}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                                    {service.duracion_minutos} min
                                                </Badge>
                                                <Badge
                                                    className="text-xs whitespace-nowrap text-white"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    {currencySymbol}{Number(service.precio).toFixed(2)}
                                                </Badge>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {selectedServices.length > 0 && (
                                    <div
                                        className="mt-4 rounded-xl p-4 flex justify-between items-center"
                                        style={{ backgroundColor: `${primaryColor}10` }}
                                    >
                                        <div>
                                            <span className="text-sm text-gray-600">Total seleccionado</span>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs text-gray-500">{totalDuration} min</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                                {currencySymbol}{totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Paso 3: fecha y horario */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r" style={{ backgroundColor: `${primaryColor}10` }}>
                        <CardTitle className="text-base flex items-center gap-2">
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                3
                            </span>
                            Elige la fecha y horario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <input
                            type="date"
                            value={selectedDate}
                            min={dateConstraints.minDate}
                            max={dateConstraints.maxDate}
                            onChange={e => {
                                setSelectedDate(e.target.value);
                                setSlots([]);
                                setSelectedSlot(null);
                                setSlotsChecked(false);
                            }}
                            className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            disabled={!selectedBarber || selectedServices.length === 0 || !selectedDate || loadingSlots}
                            onClick={checkAvailability}
                            className="w-full py-6 text-base"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                            {loadingSlots ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando disponibilidad...
                                </span>
                            ) : 'Ver horarios disponibles'}
                        </Button>

                        {slotsChecked && slots.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>No hay horarios disponibles para esta fecha.</p>
                            </div>
                        )}

                        {slots.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                {slots.map(slot => (
                                    <button
                                        key={slot.inicio}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`rounded-lg border-2 py-3 px-2 text-sm font-medium transition-all ${
                                            selectedSlot?.inicio === slot.inicio ? 'text-white' : ''
                                        }`}
                                        style={{
                                            borderColor: selectedSlot?.inicio === slot.inicio ? primaryColor : '#e5e7eb',
                                            backgroundColor: selectedSlot?.inicio === slot.inicio ? primaryColor : 'white',
                                        }}
                                    >
                                        {slot.inicio}
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Paso 4: datos del cliente */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r" style={{ backgroundColor: `${primaryColor}10` }}>
                        <CardTitle className="text-base flex items-center gap-2">
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                4
                            </span>
                            Tus datos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
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
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    value={clienteTelefono}
                                    onChange={(e) => setClienteTelefono(e.target.value)}
                                    placeholder="+57 300 000 0000"
                                    className="mt-1"
                                />
                            </div>
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
                    </CardContent>
                </Card>

                {/* Botón confirmar */}
                <Button
                    disabled={!canBook || confirmLoading}
                    className="w-full py-6 text-lg font-semibold"
                    style={{ backgroundColor: primaryColor }}
                    onClick={confirmBooking}
                >
                    {confirmLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Confirmando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirmar reserva • {currencySymbol}{totalPrice.toFixed(2)}
                        </span>
                    )}
                </Button>

                {/* Horario de atención */}
                {barberia.horario_atencion && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Horario de atención
                        </h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{barberia.horario_atencion}</p>
                    </div>
                )}

                {/* Redes sociales */}
                {(barberia.facebook_url || barberia.instagram_url) && (
                    <div className="flex justify-center gap-4">
                        {barberia.facebook_url && (
                            <a
                                href={barberia.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        )}
                        {barberia.instagram_url && (
                            <a
                                href={barberia.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        )}
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 pt-4">
                    Powered by BarberSoft
                </p>
            </main>
        </div>
    );
}
