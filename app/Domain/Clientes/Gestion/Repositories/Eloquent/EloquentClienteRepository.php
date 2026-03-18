<?php

namespace App\Domain\Clientes\Gestion\Repositories\Eloquent;

use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Clientes\Gestion\Repositories\Contracts\ClienteRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentClienteRepository implements ClienteRepositoryInterface
{
    public function findById(string $id): ?Cliente
    {
        return Cliente::find($id);
    }

    public function findAll(): Collection
    {
        return Cliente::all();
    }

    public function findByBarberia(string $barberiaId): Collection
    {
        return Cliente::where('barberia_id', $barberiaId)->orderBy('nombre')->get();
    }

    public function create(array $data): Cliente
    {
        return Cliente::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) Cliente::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) Cliente::destroy($id);
    }
}
