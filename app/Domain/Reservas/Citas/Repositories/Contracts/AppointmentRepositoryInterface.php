<?php

declare(strict_types=1);

namespace App\Domain\Reservas\Citas\Repositories\Contracts;

use App\Domain\Reservas\Citas\Entities\AppointmentEntity;
use App\Domain\Reservas\Citas\Models\Appointment;
use Illuminate\Support\Collection;
use Illuminate\Support\Carbon;

interface AppointmentRepositoryInterface
{
    public function getOccupiedSlots(string $barberId, Carbon $date): Collection;
    public function save(AppointmentEntity $appointment): Appointment;
}
