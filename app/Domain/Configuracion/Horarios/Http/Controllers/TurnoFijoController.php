<?php

namespace App\Domain\Configuracion\Horarios\Http\Controllers;

use App\Domain\Configuracion\Horarios\Http\Requests\TurnoFijoRequest;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\TurnoFijoRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use App\Domain\Clientes\Gestion\Repositories\Contracts\ClienteRepositoryInterface;
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use App\Domain\Shared\Tenancy\TenantScope;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TurnoFijoController extends Controller
{
    use TenantScope;

    public function __construct(
        protected TurnoFijoRepositoryInterface $turnoFijoRepository,
        protected BarberoRepositoryInterface $barberoRepository,
        protected ClienteRepositoryInterface $clienteRepository,
        protected ServicioRepositoryInterface $servicioRepository,
    ) {}

    public function index(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if (!$barberiaId) {
            abort(403, 'No tienes acceso a esta sección.');
        }

        // Obtener barberos de la barbería
        $barberos = $this->barberoRepository->findByBarberia($barberiaId);

        // Obtener turnos fijos del primer barbero (o del actual si está logueado)
        $currentBarbero = $this->getCurrentBarbero();
        $barberoId = $currentBarbero?->id ?? $barberos->first()?->id;

        $turnosFijos = $barberoId
            ? $this->turnoFijoRepository->findByBarbero($barberoId)
            : collect();

        $clientes = $this->clienteRepository->findByBarberia($barberiaId);
        $servicios = $this->servicioRepository->findByBarberia($barberiaId);

        return Inertia::render('configuracion/TurnosFijos', [
            'turnosFijos' => $turnosFijos,
            'barberos' => $barberos,
            'barberoId' => $barberoId,
            'clientes' => $clientes,
            'servicios' => $servicios,
        ]);
    }

    public function store(TurnoFijoRequest $request): RedirectResponse
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if (!$barberiaId) {
            abort(403, 'No tienes acceso a esta sección.');
        }

        // Verificar que el barbero pertenece a la barbería
        $barbero = $this->barberoRepository->findById($request->validated('barbero_id'));
        if (!$barbero || $barbero->barberia_id !== $barberiaId) {
            abort(403, 'El barbero no pertenece a tu barbería.');
        }

        $this->turnoFijoRepository->create($request->validated());

        return redirect()->back()->with('success', 'Turno fijo creado correctamente.');
    }

    public function update(TurnoFijoRequest $request, string $id): RedirectResponse
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if (!$barberiaId) {
            abort(403, 'No tienes acceso a esta sección.');
        }

        // Verificar que el turno fijo pertenece a la barbería
        $turnoFijo = $this->turnoFijoRepository->findById($id);
        if (!$turnoFijo || $turnoFijo->barbero->barberia_id !== $barberiaId) {
            abort(403, 'El turno fijo no pertenece a tu barbería.');
        }

        $this->turnoFijoRepository->update($id, $request->validated());

        return redirect()->back()->with('success', 'Turno fijo actualizado correctamente.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if (!$barberiaId) {
            abort(403, 'No tienes acceso a esta sección.');
        }

        // Verificar que el turno fijo pertenece a la barbería
        $turnoFijo = $this->turnoFijoRepository->findById($id);
        if (!$turnoFijo || $turnoFijo->barbero->barberia_id !== $barberiaId) {
            abort(403, 'El turno fijo no pertenece a tu barbería.');
        }

        $this->turnoFijoRepository->delete($id);

        return redirect()->back()->with('success', 'Turno fijo eliminado correctamente.');
    }

    /**
     * Obtener turnos de un barbero específico (para AJAX)
     */
    public function byBarbero(string $barberoId): \Illuminate\Http\JsonResponse
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if (!$barberiaId) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $barbero = $this->barberoRepository->findById($barberoId);
        if (!$barbero || $barbero->barberia_id !== $barberiaId) {
            return response()->json(['error' => 'Barbero no encontrado'], 404);
        }

        $turnos = $this->turnoFijoRepository->findByBarbero($barberoId);

        return response()->json(['turnos' => $turnos]);
    }
}
