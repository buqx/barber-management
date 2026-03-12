<?php

namespace App\Domain\Personal\Barberos\Repositories\Eloquent;

use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentBarberoRepository implements BarberoRepositoryInterface
{
    public function findById(string $id): ?Barbero
    {
        return Barbero::find($id);
    }

    public function findAll(): Collection
    {
        return Barbero::all();
    }

    public function create(array $data): Barbero
    {
        return Barbero::create($data);
    }

    public function update(string $id, array $data): bool
    {
        return (bool) Barbero::where('id', $id)->update($data);
    }

    public function delete(string $id): bool
    {
        return (bool) Barbero::destroy($id);
    }
}
