<?php

namespace App\Domain\Catalogo\Productos\Http\Controllers;

use App\Domain\Catalogo\Productos\Http\Requests\ProductoRequest;
use App\Domain\Catalogo\Productos\Services\ProductoService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function __construct(
        protected ProductoService $productoService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('productos/Index', [
            'productos' => $this->productoService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('productos/Create');
    }

    public function store(ProductoRequest $request)
    {
        $this->productoService->create($request->validated());
        return redirect()->route('productos.index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('productos/Show', [
            'producto' => $this->productoService->getById($id),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('productos/Edit', [
            'producto' => $this->productoService->getById($id),
        ]);
    }

    public function update(ProductoRequest $request, string $id)
    {
        $this->productoService->update($id, $request->validated());
        return redirect()->route('productos.index');
    }

    public function destroy(string $id)
    {
        $this->productoService->delete($id);
        return redirect()->route('productos.index');
    }
}
