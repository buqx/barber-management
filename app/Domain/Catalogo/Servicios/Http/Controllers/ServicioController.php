<?php

namespace App\Domain\Catalogo\Servicios\Http\Controllers;

use App\Domain\Barberia\Gestion\Services\BarberiaService;
use App\Domain\Catalogo\Servicios\Http\Requests\ServicioRequest;
use App\Domain\Catalogo\Servicios\Services\ServicioService;
use App\Domain\Shared\Tenancy\TenantScope;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ServicioController extends Controller
{
    use TenantScope;

    public function __construct(
        protected ServicioService $servicioService,
        protected BarberiaService $barberiaService,
    ) {}

    public function index(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();

        $servicios = $barberiaId
            ? $this->servicioService->getByBarberia($barberiaId)
            : $this->servicioService->getAll();

        return Inertia::render('servicios/Index', [
            'servicios' => $servicios,
        ]);
    }

    public function create(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if ($barberiaId) {
            $barberias = $this->barberiaService->getById($barberiaId)
                ? collect([$this->barberiaService->getById($barberiaId)])
                : collect();
        } else {
            $barberias = $this->barberiaService->getAll();
        }

        return Inertia::render('servicios/Create', [
            'barberias' => $barberias,
        ]);
    }

    public function store(ServicioRequest $request)
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->servicioService->create($data);
        } else {
            $this->servicioService->create($request->validated());
        }

        return redirect()->route('servicios.index');
    }

    public function show(string $id): Response
    {
        $servicio = $this->servicioService->getById($id);

        if (!$this->isGlobalAdmin() && $servicio->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este servicio.');
        }

        return Inertia::render('servicios/Show', [
            'servicio' => $servicio,
        ]);
    }

    public function edit(string $id): Response
    {
        $servicio = $this->servicioService->getById($id);

        if (!$this->isGlobalAdmin() && $servicio->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este servicio.');
        }

        return Inertia::render('servicios/Edit', [
            'servicio' => $servicio,
        ]);
    }

    public function update(ServicioRequest $request, string $id)
    {
        $servicio = $this->servicioService->getById($id);

        if (!$this->isGlobalAdmin() && $servicio->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este servicio.');
        }

        $barberiaId = $this->getCurrentBarberiaId();
        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->servicioService->update($id, $data);
        } else {
            $this->servicioService->update($id, $request->validated());
        }

        return redirect()->route('servicios.index');
    }

    public function destroy(string $id)
    {
        $servicio = $this->servicioService->getById($id);

        if (!$this->isGlobalAdmin() && $servicio->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este servicio.');
        }

        $this->servicioService->delete($id);
        return redirect()->route('servicios.index');
    }
}
