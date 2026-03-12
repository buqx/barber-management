<?php

namespace App\Domain\Clientes\Gestion\Services;

use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Clientes\Gestion\Repositories\Contracts\ClienteRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ClienteService
{
    public function __construct(
        protected ClienteRepositoryInterface $clienteRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->clienteRepository->findAll();
    }

    public function getById(string $id): ?Cliente
    {
        return $this->clienteRepository->findById($id);
    }

    public function create(array $data): Cliente
    {
        return $this->clienteRepository->create($data);
    }

    public function update(string $id, array $data): bool
    {
        return $this->clienteRepository->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->clienteRepository->delete($id);
    }
}
