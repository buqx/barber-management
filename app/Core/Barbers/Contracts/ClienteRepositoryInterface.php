<?php

namespace App\Core\Barbers\Contracts;

use Illuminate\Support\Collection;
use App\Infrastructure\Persistence\Eloquent\Cliente;

interface ClienteRepositoryInterface
{
    public function findById(string $id): ?Cliente;
    public function findAll(): Collection;
    public function create(array $data): Cliente;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
