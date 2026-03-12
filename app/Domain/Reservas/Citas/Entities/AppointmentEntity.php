<?php

declare(strict_types=1);

namespace App\Domain\Reservas\Citas\Entities;

class AppointmentEntity
{
    public function __construct(
        public readonly string $id,
        public readonly string $barberiaId,
        public readonly string $barberoId,
        public readonly string $clienteId,
        public readonly string $inicioAt,
        public readonly string $finAt,
        public readonly string $estado,
        public readonly float  $totalPagado,
        public readonly array  $serviceIds = [],
    ) {}
}
