<?php

namespace App\Domain\Configuracion\Horarios\Repositories\Contracts;

use App\Domain\Configuracion\Horarios\Models\HorarioBase;
use Illuminate\Database\Eloquent\Collection;

interface HorarioBaseRepositoryInterface
{
    public function findByBarbero(string $barberoId): Collection;
    public function findByBarberoAndDay(string $barberoId, int $diaSemana): Collection;
    public function create(array $data): HorarioBase;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
