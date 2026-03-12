<?php

namespace App\Domain\Configuracion\Horarios\Repositories\Eloquent;

use App\Domain\Configuracion\Horarios\Models\HorarioBase;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentHorarioBaseRepository implements HorarioBaseRepositoryInterface
{
    public function findByBarbero(string $barberoId): Collection
    {
        return HorarioBase::where('barbero_id', $barberoId)
            ->orderBy('dia_semana')
            ->get();
    }

    public function findByBarberoAndDay(string $barberoId, int $diaSemana): Collection
    {
        return HorarioBase::where('barbero_id', $barberoId)
            ->where('dia_semana', $diaSemana)
            ->get();
    }

    public function create(array $data): HorarioBase
    {
        return HorarioBase::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) HorarioBase::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) HorarioBase::destroy($id);
    }
}
