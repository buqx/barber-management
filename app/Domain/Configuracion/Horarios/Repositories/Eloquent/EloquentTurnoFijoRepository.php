<?php

namespace App\Domain\Configuracion\Horarios\Repositories\Eloquent;

use App\Domain\Configuracion\Horarios\Models\TurnoFijo;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\TurnoFijoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentTurnoFijoRepository implements TurnoFijoRepositoryInterface
{
    public function findByBarbero(string $barberoId): Collection
    {
        return TurnoFijo::where('barbero_id', $barberoId)
            ->with(['cliente', 'servicios'])
            ->orderBy('dia_semana')
            ->orderBy('hora_inicio')
            ->get();
    }

    public function findByBarberoAndDay(string $barberoId, int $diaSemana): Collection
    {
        return TurnoFijo::where('barbero_id', $barberoId)
            ->where('dia_semana', $diaSemana)
            ->where('activo', true)
            ->with('servicios')
            ->get();
    }

    public function findActiveByBarbero(string $barberoId): Collection
    {
        return TurnoFijo::where('barbero_id', $barberoId)
            ->where('activo', true)
            ->with(['cliente', 'servicios'])
            ->orderBy('dia_semana')
            ->orderBy('hora_inicio')
            ->get();
    }

    public function findById(string $id): ?TurnoFijo
    {
        return TurnoFijo::with(['cliente', 'servicios'])->find($id);
    }

    public function create(array $data): TurnoFijo
    {
        $servicios = $data['servicios'] ?? [];
        unset($data['servicios']);

        $turnoFijo = TurnoFijo::create($data);

        if (!empty($servicios)) {
            $turnoFijo->servicios()->attach($servicios);
        }

        return $turnoFijo->fresh(['cliente', 'servicios']);
    }

    public function update(string $id, array $data): bool
    {
        $servicios = $data['servicios'] ?? null;
        unset($data['servicios']);

        $turnoFijo = TurnoFijo::find($id);

        if (!$turnoFijo) {
            return false;
        }

        $turnoFijo->update($data);

        if ($servicios !== null) {
            $turnoFijo->servicios()->sync($servicios);
        }

        return true;
    }

    public function delete(string $id): bool
    {
        return (bool) TurnoFijo::destroy($id);
    }
}
