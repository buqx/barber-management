<?php

namespace App\Domain\Catalogo\Productos\Services;

use App\Domain\Catalogo\Productos\Models\Producto;
use App\Domain\Catalogo\Productos\Repositories\Contracts\ProductoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductoService
{
    public function __construct(
        protected ProductoRepositoryInterface $productoRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->productoRepository->findAll();
    }

    public function getByBarberia(string $barberiaId): Collection
    {
        return Producto::where('barberia_id', $barberiaId)->get();
    }

    public function getById(string $id): ?Producto
    {
        return $this->productoRepository->findById($id);
    }

    public function create(array $data): Producto
    {
        return $this->productoRepository->create($data);
    }

    public function update(string $id, array $data): bool
    {
        return $this->productoRepository->update($id, $data);
    }

    public function delete(string $id): bool
    {
        return $this->productoRepository->delete($id);
    }
}
