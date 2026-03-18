<?php

namespace App\Domain\Catalogo\Servicios\Repositories\Contracts;

use App\Domain\Catalogo\Servicios\Models\Servicio;
use Illuminate\Database\Eloquent\Collection;

interface ServicioRepositoryInterface
{
    public function findById(string $id): ?Servicio;
    public function findAll(): Collection;
    public function findByBarberia(string $barberiaId): Collection;
    public function sumDuration(array $ids): int;
    public function sumPrice(array $ids): float;
    public function create(array $data): Servicio;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
