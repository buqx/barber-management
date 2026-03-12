<?php

namespace App\Domain\Barberia\Gestion\Services;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Barberia\Gestion\Repositories\Contracts\BarberiaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BarberiaService
{
    public function __construct(
        protected BarberiaRepositoryInterface $barberiaRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->barberiaRepository->all();
    }

    public function getById(string $id): ?Barberia
    {
        return $this->barberiaRepository->find($id);
    }

    public function create(array $data): Barberia
    {
        if (!isset($data['slug']) && isset($data['nombre'])) {
            $data['slug'] = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $data['nombre']));
        }
        return $this->barberiaRepository->create($data);
    }

    public function update(string $id, array $data): ?Barberia
    {
        return $this->barberiaRepository->update($id, $data);
    }

    public function delete(string $id): ?Barberia
    {
        return $this->barberiaRepository->delete($id);
    }
}
