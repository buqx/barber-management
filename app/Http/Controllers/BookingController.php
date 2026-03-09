<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Infrastructure\Persistence\Eloquent\Barbero;
use App\Infrastructure\Persistence\Eloquent\Servicio;
use App\Core\Appointments\Services\AppointmentService;
use App\Http\Requests\StoreAppointmentRequest;
use Illuminate\Support\Carbon;

class BookingController extends Controller
{
    public function showStep1(Request $request, string $tenant)
    {
        $barbers = Barbero::all();
        $services = Servicio::all();
        return Inertia::render('Booking/Step1', [
            'barbers' => $barbers,
            'services' => $services,
        ]);
    }

    public function checkAvailability(StoreAppointmentRequest $request, AppointmentService $appointmentService)
    {
        $validated = $request->validated();
        $barberId = $validated['barber_id'];
        $serviceIds = $validated['service_ids'];
        $date = Carbon::parse($validated['date']);
        $slots = $appointmentService->getAvailableWindows($barberId, $serviceIds, $date);
        return Inertia::render('Booking/Step1', [
            'availableSlots' => $slots,
        ]);
    }
}
