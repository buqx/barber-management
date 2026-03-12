<?php

namespace App\Domain\Catalogo\Productos\Repositories\Eloquent;

use App\Domain\Catalogo\Productos\Models\Producto;
use App\Domain\Catalogo\Productos\Repositories\Contracts\ProductoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentProductoRepository implements ProductoRepositoryInterface
{
    public function findById(string $id): ?Producto
    {
        return Producto::find($id);
    }

    public function findAll(): Collection
    {
        return Producto::all();
    }

    public function create(array $data): Producto
    {
        return Producto::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) Producto::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) Producto::destroy($id);
    }
}
