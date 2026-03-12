<?php

namespace App\Domain\Configuracion\Horarios\Repositories\Contracts;

use App\Domain\Configuracion\Horarios\Models\BloqueoExcepcion;
use Illuminate\Database\Eloquent\Collection;

interface BloqueoExcepcionRepositoryInterface
{
    public function findByBarbero(string $barberoId): Collection;
    public function findForBarberoOnDate(string $barberoId, string $date): Collection;
    public function create(array $data): BloqueoExcepcion;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
