<?php

namespace App\Core\Barbers\Contracts;

use Illuminate\Support\Collection;
use App\Infrastructure\Persistence\Eloquent\Barbero;

interface BarberoRepositoryInterface
{
    public function findById(string $id): ?Barbero;
    public function findAll(): Collection;
    public function create(array $data): Barbero;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
