<?php

namespace App\Domain\Personal\Barberos\Repositories\Contracts;

use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Database\Eloquent\Collection;

interface BarberoRepositoryInterface
{
    public function findById(string $id): ?Barbero;
    public function findAll(): Collection;
    public function findByBarberia(string $barberiaId): Collection;
    public function create(array $data): Barbero;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
