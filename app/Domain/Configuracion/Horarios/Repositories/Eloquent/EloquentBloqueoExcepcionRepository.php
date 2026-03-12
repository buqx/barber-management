<?php

namespace App\Domain\Configuracion\Horarios\Repositories\Eloquent;

use App\Domain\Configuracion\Horarios\Models\BloqueoExcepcion;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\BloqueoExcepcionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentBloqueoExcepcionRepository implements BloqueoExcepcionRepositoryInterface
{
    public function findForBarberoOnDate(string $barberoId, string $date): Collection
    {
        return BloqueoExcepcion::where('barbero_id', $barberoId)
            ->whereDate('fecha_inicio', '<=', $date)
            ->whereDate('fecha_fin', '>=', $date)
            ->get();
    }

    public function create(array $data): BloqueoExcepcion
    {
        return BloqueoExcepcion::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) BloqueoExcepcion::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) BloqueoExcepcion::destroy($id);
    }
}
