<?php

namespace App\Domain\Catalogo\Productos\Http\Controllers;

use App\Domain\Catalogo\Productos\Http\Requests\ProductoRequest;
use App\Domain\Catalogo\Productos\Services\ProductoService;
use App\Domain\Shared\Tenancy\TenantScope;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    use TenantScope;

    public function __construct(
        protected ProductoService $productoService,
    ) {}

    public function index(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();

        $productos = $barberiaId
            ? $this->productoService->getByBarberia($barberiaId)
            : $this->productoService->getAll();

        return Inertia::render('productos/Index', [
            'productos' => $productos,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('productos/Create');
    }

    public function store(ProductoRequest $request)
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->productoService->create($data);
        } else {
            $this->productoService->create($request->validated());
        }

        return redirect()->route('productos.index');
    }

    public function show(string $id): Response
    {
        $producto = $this->productoService->getById($id);

        if (!$this->isGlobalAdmin() && $producto->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este producto.');
        }

        return Inertia::render('productos/Show', [
            'producto' => $producto,
        ]);
    }

    public function edit(string $id): Response
    {
        $producto = $this->productoService->getById($id);

        if (!$this->isGlobalAdmin() && $producto->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este producto.');
        }

        return Inertia::render('productos/Edit', [
            'producto' => $producto,
        ]);
    }

    public function update(ProductoRequest $request, string $id)
    {
        $producto = $this->productoService->getById($id);

        if (!$this->isGlobalAdmin() && $producto->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este producto.');
        }

        $barberiaId = $this->getCurrentBarberiaId();
        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->productoService->update($id, $data);
        } else {
            $this->productoService->update($id, $request->validated());
        }

        return redirect()->route('productos.index');
    }

    public function destroy(string $id)
    {
        $producto = $this->productoService->getById($id);

        if (!$this->isGlobalAdmin() && $producto->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este producto.');
        }

        $this->productoService->delete($id);
        return redirect()->route('productos.index');
    }
}
