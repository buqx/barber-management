<?php

namespace App\Domain\Configuracion\Horarios\Repositories\Contracts;

use App\Domain\Configuracion\Horarios\Models\TurnoFijo;
use Illuminate\Database\Eloquent\Collection;

interface TurnoFijoRepositoryInterface
{
    public function findByBarbero(string $barberoId): Collection;
    public function findByBarberoAndDay(string $barberoId, int $diaSemana): Collection;
    public function findActiveByBarbero(string $barberoId): Collection;
    public function findById(string $id): ?TurnoFijo;
    public function create(array $data): TurnoFijo;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
