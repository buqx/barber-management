<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Core\Appointments\Contracts\AppointmentRepositoryInterface;
use App\Core\Appointments\Entities\AppointmentEntity;
use Illuminate\Support\Collection;
use Illuminate\Support\Carbon;

class EloquentAppointmentRepository implements AppointmentRepositoryInterface
{
    public function getOccupiedSlots(string $barberId, Carbon $date): Collection
    {
        return Appointment::where('barbero_id', $barberId)
            ->whereDate('inicio_at', $date->toDateString())
            ->get(['inicio_at', 'fin_at']);
    }

    public function save(AppointmentEntity $appointment): Appointment
    {
        $data = [
            'id' => $appointment->id,
            'barberia_id' => $appointment->barberiaId,
            'barbero_id' => $appointment->barberoId,
            'cliente_id' => $appointment->clienteId,
            'inicio_at' => $appointment->inicioAt,
            'fin_at' => $appointment->finAt,
            'estado' => $appointment->estado,
            'total_pagado' => $appointment->totalPagado,
        ];
        return Appointment::create($data);
    }
}
