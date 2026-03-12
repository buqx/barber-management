<?php

namespace App\Domain\Reservas\Citas\Http\Controllers;

use App\Domain\Reservas\Citas\Http\Requests\StoreAppointmentRequest;
use App\Domain\Reservas\Citas\Http\Requests\ConfirmBookingRequest;
use App\Domain\Reservas\Citas\Services\AppointmentService;
use App\Domain\Reservas\Citas\Entities\AppointmentEntity;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        protected AppointmentService          $appointmentService,
        protected BarberoRepositoryInterface  $barberoRepository,
        protected ServicioRepositoryInterface $servicioRepository,
    ) {}

    public function showStep1(Request $request, string $tenant): Response
    {
        return Inertia::render('Booking/Step1', [
            'barbers'  => $this->barberoRepository->findAll(),
            'services' => $this->servicioRepository->findAll(),
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

        // Find or create client
        $cliente = Cliente::firstOrCreate(
            [
                'barberia_id' => $barberia->id,
                'email' => $validated['cliente_email'],
            ],
            [
                'nombre' => $validated['cliente_nombre'],
                'email' => $validated['cliente_email'],
                'telefono' => $validated['cliente_telefono'] ?? null,
            ]
        );

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
            return response()->json([
                'success' => true,
                'appointment' => $appointment,
                'message' => 'Cita confirmada correctamente.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
