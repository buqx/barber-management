<?php

namespace App\Domain\Reservas\Citas\Http\Controllers;

use App\Domain\Reservas\Citas\Http\Requests\StoreAppointmentRequest;
use App\Domain\Reservas\Citas\Services\AppointmentService;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
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
}
