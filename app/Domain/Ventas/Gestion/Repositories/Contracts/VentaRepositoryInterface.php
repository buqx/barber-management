<?php

namespace App\Domain\Ventas\Gestion\Repositories\Contracts;

use App\Domain\Ventas\Gestion\Models\Venta;
use Illuminate\Database\Eloquent\Collection;

interface VentaRepositoryInterface
{
    public function findById(string $id): ?Venta;
    public function findAll(): Collection;
    public function create(array $data): Venta;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
