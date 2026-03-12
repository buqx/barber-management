<?php

declare(strict_types=1);

namespace App\Domain\Reservas\Citas\Repositories\Eloquent;

use App\Domain\Reservas\Citas\Entities\AppointmentEntity;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Domain\Reservas\Citas\Repositories\Contracts\AppointmentRepositoryInterface;
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
        return Appointment::create([
            'id'           => $appointment->id,
            'barberia_id'  => $appointment->barberiaId,
            'barbero_id'   => $appointment->barberoId,
            'cliente_id'   => $appointment->clienteId,
            'inicio_at'    => $appointment->inicioAt,
            'fin_at'       => $appointment->finAt,
            'estado'       => $appointment->estado,
            'total_pagado' => $appointment->totalPagado,
        ]);
    }
}
