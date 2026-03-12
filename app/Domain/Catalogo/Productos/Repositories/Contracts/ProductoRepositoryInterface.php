<?php

namespace App\Domain\Catalogo\Productos\Repositories\Contracts;

use App\Domain\Catalogo\Productos\Models\Producto;
use Illuminate\Database\Eloquent\Collection;

interface ProductoRepositoryInterface
{
    public function findById(string $id): ?Producto;
    public function findAll(): Collection;
    public function create(array $data): Producto;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
