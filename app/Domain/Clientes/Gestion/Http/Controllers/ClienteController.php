<?php

namespace App\Domain\Clientes\Gestion\Http\Controllers;

use App\Domain\Barberia\Gestion\Services\BarberiaService;
use App\Domain\Clientes\Gestion\Http\Requests\ClienteRequest;
use App\Domain\Clientes\Gestion\Services\ClienteService;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Shared\Tenancy\TenantScope;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    use TenantScope;

    public function __construct(
        protected ClienteService $clienteService,
        protected BarberiaService $barberiaService,
    ) {}

    public function index(): Response
    {
        $barberiaId = $this->getCurrentBarberiaId();

        $clientes = $barberiaId
            ? $this->clienteService->getByBarberia($barberiaId)
            : $this->clienteService->getAll();

        return Inertia::render('clientes/Index', [
            'clientes' => $clientes,
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

        return Inertia::render('clientes/Create', [
            'barberias' => $barberias,
        ]);
    }

    public function store(ClienteRequest $request)
    {
        $barberiaId = $this->getCurrentBarberiaId();

        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->clienteService->create($data);
        } else {
            $this->clienteService->create($request->validated());
        }

        return redirect()->route('clientes.index');
    }

    public function show(string $id): Response
    {
        $cliente = $this->clienteService->getById($id);

        if (!$this->isGlobalAdmin() && $cliente->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este cliente.');
        }

        return Inertia::render('clientes/Show', [
            'cliente' => $cliente,
        ]);
    }

    public function edit(string $id): Response
    {
        $cliente = $this->clienteService->getById($id);

        if (!$this->isGlobalAdmin() && $cliente->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este cliente.');
        }

        return Inertia::render('clientes/Edit', [
            'cliente' => $cliente,
        ]);
    }

    public function update(ClienteRequest $request, string $id)
    {
        $cliente = $this->clienteService->getById($id);

        if (!$this->isGlobalAdmin() && $cliente->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este cliente.');
        }

        $barberiaId = $this->getCurrentBarberiaId();
        if ($barberiaId) {
            $data = $request->validated();
            $data['barberia_id'] = $barberiaId;
            $this->clienteService->update($id, $data);
        } else {
            $this->clienteService->update($id, $request->validated());
        }

        return redirect()->route('clientes.index');
    }

    public function destroy(string $id)
    {
        $cliente = $this->clienteService->getById($id);

        if (!$this->isGlobalAdmin() && $cliente->barberia_id !== $this->getCurrentBarberiaId()) {
            abort(403, 'No tienes acceso a este cliente.');
        }

        $this->clienteService->delete($id);
        return redirect()->route('clientes.index');
    }
}
