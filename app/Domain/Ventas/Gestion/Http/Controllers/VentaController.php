<?php

namespace App\Domain\Ventas\Gestion\Http\Controllers;

use App\Domain\Ventas\Gestion\Services\VentaService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class VentaController extends Controller
{
    public function __construct(
        protected VentaService $ventaService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('ventas/Index', [
            'ventas' => $this->ventaService->getAll(),
        ]);
    }

    public function show(string $id): Response
    {
        return Inertia::render('ventas/Show', [
            'venta' => $this->ventaService->getById($id),
        ]);
    }
}
