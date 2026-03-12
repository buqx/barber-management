<?php

namespace App\Domain\Ventas\Gestion\Http\Controllers;

use App\Domain\Catalogo\Productos\Services\ProductoService;
use App\Domain\Clientes\Gestion\Services\ClienteService;
use App\Domain\Personal\Barberos\Services\BarberoService;
use App\Domain\Reservas\Citas\Models\Appointment;
use App\Domain\Catalogo\Servicios\Services\ServicioService;
use App\Domain\Ventas\Gestion\Http\Requests\VentaStoreRequest;
use App\Domain\Ventas\Gestion\Services\VentaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class VentaController extends Controller
{
    public function __construct(
        protected VentaService $ventaService,
        protected ServicioService $servicioService,
        protected ProductoService $productoService,
        protected ClienteService $clienteService,
        protected BarberoService $barberoService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('ventas/Index', [
            'ventas' => $this->ventaService->getAll(),
        ]);
    }

    public function create(Request $request): Response
    {
        $citaId = $request->query('cita_id');
        $cita = $citaId
            ? Appointment::with(['cliente', 'barbero'])->find($citaId)
            : null;

        return Inertia::render('ventas/Create', [
            'cita' => $cita,
            'citas' => Appointment::with(['cliente', 'barbero'])
                ->whereIn('estado', ['pendiente', 'confirmada', 'completada'])
                ->orderByDesc('inicio_at')
                ->get(),
            'servicios' => $this->servicioService->getAll(),
            'productos' => $this->productoService->getAll(),
            'clientes' => $this->clienteService->getAll(),
            'barberos' => $this->barberoService->getAll(),
        ]);
    }

    public function store(VentaStoreRequest $request): RedirectResponse
    {
        $venta = $this->ventaService->create($request->validated());

        return redirect()->route('ventas.show', $venta->id)
            ->with('success', 'Venta registrada correctamente.');
    }

    public function show(string $id): Response
    {
        $venta = $this->ventaService->getById($id);

        return Inertia::render('ventas/Show', [
            'venta' => $venta,
        ]);
    }
}
