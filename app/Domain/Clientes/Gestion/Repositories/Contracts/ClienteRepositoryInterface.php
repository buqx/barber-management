<?php

namespace App\Domain\Clientes\Gestion\Repositories\Contracts;

use App\Domain\Clientes\Gestion\Models\Cliente;
use Illuminate\Database\Eloquent\Collection;

interface ClienteRepositoryInterface
{
    public function findById(string $id): ?Cliente;
    public function findAll(): Collection;
    public function create(array $data): Cliente;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
}
