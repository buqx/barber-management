<?php

namespace App\Core\Services\Contracts;

use Illuminate\Support\Collection;
use App\Infrastructure\Persistence\Eloquent\Servicio;

interface ServicioRepositoryInterface
{
    public function findById(string $id): ?Servicio;
    public function findAll(): Collection;
    public function create(array $data): Servicio;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
