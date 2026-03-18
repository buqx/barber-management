<?php

namespace App\Domain\Catalogo\Servicios\Repositories\Eloquent;

use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentServicioRepository implements ServicioRepositoryInterface
{
    public function findById(string $id): ?Servicio
    {
        return Servicio::find($id);
    }

    public function findAll(): Collection
    {
        return Servicio::all();
    }

    public function findByBarberia(string $barberiaId): Collection
    {
        return Servicio::where('barberia_id', $barberiaId)->orderBy('nombre')->get();
    }

    public function sumDuration(array $ids): int
    {
        return (int) Servicio::whereIn('id', $ids)->sum('duracion_minutos');
    }

    public function sumPrice(array $ids): float
    {
        return (float) Servicio::whereIn('id', $ids)->sum('precio');
    }

    public function create(array $data): Servicio
    {
        return Servicio::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) Servicio::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) Servicio::destroy($id);
    }
}
