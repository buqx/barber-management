<?php

namespace App\Domain\Barberia\Gestion\Repositories\Eloquent;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Barberia\Gestion\Repositories\Contracts\BarberiaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentBarberiaRepository implements BarberiaRepositoryInterface
{
    public function all(): Collection
    {
        return Barberia::all();
    }

    public function find(string $id): ?Barberia
    {
        return Barberia::find($id);
    }

    public function create(array $data): Barberia
    {
        return Barberia::create($data);
    }

    public function update(string $id, array $data): ?Barberia
    {
        $barberia = Barberia::find($id);
        if ($barberia) {
            $barberia->update($data);
        }
        return $barberia;
    }

    public function delete(string $id): ?Barberia
    {
        $barberia = Barberia::find($id);
        if ($barberia) {
            $barberia->delete();
        }
        return $barberia;
    }
}
