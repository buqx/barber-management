<?php

namespace App\Domain\Personal\Barberos\Http\Controllers;

use App\Domain\Catalogo\Servicios\Services\ServicioService;
use App\Domain\Barberia\Gestion\Services\BarberiaService;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\BloqueoExcepcionRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use App\Domain\Personal\Barberos\Http\Requests\BarberoRequest;
use App\Domain\Personal\Barberos\Services\BarberoService;
use App\Domain\Shared\Tenancy\TenantScope;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BarberoController extends Controller
{
    use TenantScope;

    public function __construct(
        protected BarberoService $barberoService,
        protected BarberiaService $barberiaService,
        protected HorarioBaseRepositoryInterface $horarioRepository,
        protected BloqueoExcepcionRepositoryInterface $bloqueoRepository,
        protected ServicioService $servicioService,
    ) {}

    public function index(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();

        // Si es admin global, mostrar todas las barberías
        // Si es dueño, mostrar solo los de su barbería
        $barberos = $barberiaId
            ? $this->barberoService->getByBarberia($barberiaId)
            : $this->barberoService->getAll();

        return Inertia::render('barberos/Index', [
            'barberos' => $barberos,
        ]);
    }

    public function create(): Response
    {
        // Si no es admin global, solo puede crear barberos para su barbería
        $barberiaId = $this->getCurrentBarberiaId();

        if ($barberiaId) {
            // Es dueño, solo puede ver su barbería
            $barberias = $this->barberiaService->getById($barberiaId)
                ? collect([$this->barberiaService->getById($barberiaId)])
                : collect();
        } else {
            // Es admin global
            $barberias = $this->barberiaService->getAll();
        }

        return Inertia::render('barberos/Create', [
            'barberias' => $barberias,
        ]);
    }

    public function store(BarberoRequest $request)
    {
        // Verificar que no pueda crear barberos en otras barberías
        $barberiaId = $this->getCurrentBarberiaId();

        if ($barberiaId) {
            // Es dueño, forzar su barbería
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->barberoService->create($data);
        } else {
            // Es admin global
            $this->barberoService->create($request->validated());
        }

        return redirect()->route('barberos.index');
    }

    public function show(string $id): Response
    {
        $barbero = $this->barberoService->getById($id);

        // Verificar acceso
        if (!$this->isGlobalAdmin() && $barbero->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este barbero.');
        }

        return Inertia::render('barberos/Show', [
            'barbero'              => $barbero,
            'horarios'             => $this->horarioRepository->findByBarbero($id),
            'bloqueos'             => $this->bloqueoRepository->findByBarbero($id),
            'serviciosDisponibles' => $this->servicioService->getAll(),
            'serviciosAsignados'   => $barbero->servicios->pluck('id'),
        ]);
    }

    public function edit(string $id): Response
    {
        $barbero = $this->barberoService->getById($id);

        // Verificar acceso
        if (!$this->isGlobalAdmin() && $barbero->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este barbero.');
        }

        return Inertia::render('barberos/Edit', [
            'barbero' => $barbero,
        ]);
    }

    public function update(BarberoRequest $request, string $id)
    {
        $barbero = $this->barberoService->getById($id);

        // Verificar acceso
        if (!$this->isGlobalAdmin() && $barbero->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este barbero.');
        }

        // Si es dueño, mantener su barbería
        $barberiaId = $this->getCurrentBarberiaId();
        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->barberoService->update($id, $data);
        } else {
            $this->barberoService->update($id, $request->validated());
        }

        return redirect()->route('barberos.index');
    }

    public function destroy(string $id)
    {
        $barbero = $this->barberoService->getById($id);

        // Verificar acceso
        if (!$this->isGlobalAdmin() && $barbero->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este barbero.');
        }

        $this->barberoService->delete($id);
        return redirect()->route('barberos.index');
    }
}
