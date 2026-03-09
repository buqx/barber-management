<?php

declare(strict_types=1);

namespace App\Core\Barbers\ValueObjects;

use InvalidArgumentException;

class TimeSlot
{
    public readonly string $horaInicio;
    public readonly string $horaFin;

    public function __construct(string $horaInicio, string $horaFin)
    {
        if ($horaInicio >= $horaFin) {
            throw new InvalidArgumentException('La hora de inicio debe ser menor a la hora de fin.');
        }
        $this->horaInicio = $horaInicio;
        $this->horaFin = $horaFin;
    }
}
