<?php

namespace App\Domain\Personal\Barberos\Services;

use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BarberoService
{
    public function __construct(
        protected BarberoRepositoryInterface $barberoRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->barberoRepository->findAll();
    }

    public function getById(string $id): ?Barbero
    {
        return $this->barberoRepository->findById($id);
    }

    public function create(array $data): Barbero
    {
        return $this->barberoRepository->create($data);
    }

    public function update(string $id, array $data): bool
    {
        return $this->barberoRepository->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->barberoRepository->delete($id);
    }
}
