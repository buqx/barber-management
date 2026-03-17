<?php

namespace App\Domain\Catalogo\Servicios\Services;

use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ServicioService
{
    public function __construct(
        protected ServicioRepositoryInterface $servicioRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->servicioRepository->findAll();
    }

    public function getByBarberia(string $barberiaId): Collection
    {
        return Servicio::where('barberia_id', $barberiaId)->get();
    }

    public function getById(string $id): ?Servicio
    {
        return $this->servicioRepository->findById($id);
    }

    public function create(array $data): Servicio
    {
        return $this->servicioRepository->create($data);
    }

    public function update(string $id, array $data): bool
    {
        return $this->servicioRepository->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->servicioRepository->delete($id);
    }
}
