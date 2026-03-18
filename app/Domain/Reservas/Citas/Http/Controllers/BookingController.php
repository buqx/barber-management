<?php

namespace App\Domain\Reservas\Citas\Http\Controllers;

use App\Domain\Reservas\Citas\Http\Requests\StoreAppointmentRequest;
use App\Domain\Reservas\Citas\Http\Requests\ConfirmBookingRequest;
use App\Domain\Reservas\Citas\Services\AppointmentService;
use App\Domain\Reservas\Citas\Entities\AppointmentEntity;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use App\Jobs\SendAppointmentNotificationToBarber;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        protected AppointmentService          $appointmentService,
        protected BarberoRepositoryInterface  $barberoRepository,
        protected ServicioRepositoryInterface $servicioRepository,
    ) {}

    public function showStep1(Request $request, string $tenant, ?string $barberoSlug = null): Response
    {
        $barberia = app('tenant');

        if (!$barberia) {
            abort(404, 'Barbería no encontrada');
        }

        // Verificar si el booking está habilitado
        if (!$barberia->isBookingActivo()) {
            return Inertia::render('Booking/Step1', [
                'barbers'  => [],
                'services' => [],
                'barberia' => null,
                'bookingCerrado' => true,
                'barberoSeleccionado' => null,
            ]);
        }

        // Si hay un barbero específico, obtenerlo
        $barberoSeleccionado = null;
        if ($barberoSlug) {
            $barbero = $this->barberoRepository->findBySlug($barberoSlug);
            if ($barbero && $barbero->booking_publico) {
                $barberoSeleccionado = [
                    'id' => $barbero->id,
                    'nombre' => $barbero->nombre,
                    'foto_url' => $barbero->foto_url,
                    'slug' => $barbero->slug,
                ];
            }
        }

        return Inertia::render('Booking/Step1', [
            'barbers'  => $this->barberoRepository->findAll(),
            'services' => $this->servicioRepository->findAll(),
            'barberia' => [
                'id' => $barberia->id,
                'nombre' => $barberia->nombre,
                'slug' => $barberia->slug,
                'logo_url' => $barberia->logo_url_final,
                'banner_url' => $barberia->banner_url_final,
                'color_primario' => $barberia->color_primario ?? '#1a1a1a',
                'color_secundario' => $barberia->color_secundario ?? '#f5f5f5',
                'descripcion' => $barberia->descripcion,
                'telefono' => $barberia->telefono,
                'direccion' => $barberia->direccion,
                'facebook_url' => $barberia->facebook_url,
                'instagram_url' => $barberia->instagram_url,
                'horario_atencion' => $barberia->horario_atencion,
                'booking_habilitado' => $barberia->booking_habilitado,
                'dias_anticipacion' => $barberia->dias_anticipacion ?? 30,
                'intervalo_citas' => $barberia->intervalo_citas ?? 30,
                'moneda' => $barberia->moneda,
            ],
            'bookingCerrado' => false,
            'barberoSeleccionado' => $barberoSeleccionado,
        ]);
    }

    public function checkAvailability(StoreAppointmentRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated  = $request->validated();
        $barberId   = $validated['barber_id'];
        $serviceIds = $validated['service_ids'];
        $date       = Carbon::parse($validated['date']);

        $slots = $this->appointmentService->getAvailableWindows($barberId, $serviceIds, $date);

        return response()->json(['slots' => $slots]);
    }

    public function confirm(ConfirmBookingRequest $request, string $tenant): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $barberia = app('tenant');
        if (!$barberia) {
            return response()->json(['error' => 'Barberia context required'], 400);
        }

        // Find or create client - buscar por email
        $email = $validated['cliente_email'];

        $cliente = Cliente::where('barberia_id', $barberia->id)
            ->where('email', $email)
            ->first();

        // Crear o actualizar cliente
        if (!$cliente) {
            $cliente = Cliente::create([
                'barberia_id' => $barberia->id,
                'nombre' => $validated['cliente_nombre'],
                'email' => $email,
                'telefono' => $validated['cliente_telefono'],
            ]);
        } else {
            // Actualizar datos si el cliente existe
            $cliente->update([
                'nombre' => $validated['cliente_nombre'],
                'telefono' => $validated['cliente_telefono'],
            ]);
        }

        // Calculate fin_at from date + slot_fin
        $fecha = Carbon::parse($validated['date']);
        $inicioAt = $fecha->copy()->setTimeFromTimeString($validated['slot_inicio']);
        $finAt = $fecha->copy()->setTimeFromTimeString($validated['slot_fin']);

        // Calculate total price
        $totalPrice = $this->servicioRepository->sumPrice($validated['service_ids']);

        // Create appointment
        $appointmentEntity = new AppointmentEntity(
            id: Str::uuid()->toString(),
            barberiaId: $barberia->id,
            barberoId: $validated['barber_id'],
            clienteId: $cliente->id,
            inicioAt: $inicioAt->toDateTimeString(),
            finAt: $finAt->toDateTimeString(),
            estado: 'pendiente',
            totalPagado: 0,
            serviceIds: $validated['service_ids'],
        );

        try {
            $appointment = $this->appointmentService->bookAppointment($appointmentEntity);

            // Dispatch email to barber in the background (queue)
            SendAppointmentNotificationToBarber::dispatch($appointment);

            return response()->json([
                'success' => true,
                'appointment' => $appointment,
                'message' => 'Cita registrada. El barbero recibirá una notificación para confirmar tu cita.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
