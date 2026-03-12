<?php

namespace App\Domain\Catalogo\Servicios\Http\Controllers;

use App\Domain\Barberia\Gestion\Services\BarberiaService;
use App\Domain\Catalogo\Servicios\Http\Requests\ServicioRequest;
use App\Domain\Catalogo\Servicios\Services\ServicioService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ServicioController extends Controller
{
    public function __construct(
        protected ServicioService $servicioService,
        protected BarberiaService $barberiaService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('servicios/Index', [
            'servicios' => $this->servicioService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('servicios/Create', [
            'barberias' => $this->barberiaService->getAll(),
        ]);
    }

    public function store(ServicioRequest $request)
    {
        $this->servicioService->create($request->validated());
        return redirect()->route('servicios.index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('servicios/Show', [
            'servicio' => $this->servicioService->getById($id),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('servicios/Edit', [
            'servicio' => $this->servicioService->getById($id),
        ]);
    }

    public function update(ServicioRequest $request, string $id)
    {
        $this->servicioService->update($id, $request->validated());
        return redirect()->route('servicios.index');
    }

    public function destroy(string $id)
    {
        $this->servicioService->delete($id);
        return redirect()->route('servicios.index');
    }
}
