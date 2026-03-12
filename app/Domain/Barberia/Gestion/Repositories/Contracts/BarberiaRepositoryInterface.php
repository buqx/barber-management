<?php

namespace App\Domain\Barberia\Gestion\Repositories\Contracts;

use App\Domain\Barberia\Gestion\Models\Barberia;
use Illuminate\Database\Eloquent\Collection;

interface BarberiaRepositoryInterface
{
    public function all(): Collection;
    public function find(string $id): ?Barberia;
    public function create(array $data): Barberia;
    public function update(string $id, array $data): ?Barberia;
    public function delete(string $id): ?Barberia;
}
