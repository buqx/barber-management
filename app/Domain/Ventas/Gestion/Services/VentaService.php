<?php

namespace App\Domain\Ventas\Gestion\Services;

use App\Domain\Ventas\Gestion\Models\Venta;
use App\Domain\Ventas\Gestion\Repositories\Contracts\VentaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VentaService
{
    public function __construct(
        protected VentaRepositoryInterface $ventaRepository,
    ) {}

    public function getAll(): Collection
    {
        return $this->ventaRepository->findAll();
    }

    public function getById(string $id): ?Venta
    {
        return $this->ventaRepository->findById($id);
    }
}
