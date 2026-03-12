<?php

namespace App\Domain\Ventas\Gestion\Repositories\Eloquent;

use App\Domain\Ventas\Gestion\Models\Venta;
use App\Domain\Ventas\Gestion\Repositories\Contracts\VentaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentVentaRepository implements VentaRepositoryInterface
{
    public function findById(string $id): ?Venta
    {
        return Venta::with('detalles')->find($id);
    }

    public function findAll(): Collection
    {
        return Venta::with('detalles')->get();
    }

    public function create(array $data): Venta
    {
        return Venta::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) Venta::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) Venta::destroy($id);
    }
}
