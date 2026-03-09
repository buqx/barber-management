<?php

declare(strict_types=1);

namespace App\Core\Appointments\Contracts;

use Illuminate\Support\Collection;
use App\Core\Appointments\Entities\AppointmentEntity;
use Illuminate\Support\Carbon;

interface AppointmentRepositoryInterface
{
    public function getOccupiedSlots(string $barberId, Carbon $date): Collection;
    public function save(AppointmentEntity $appointment): mixed;
}
