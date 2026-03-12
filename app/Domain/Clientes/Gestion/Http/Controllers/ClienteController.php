<?php

namespace App\Domain\Clientes\Gestion\Http\Controllers;

use App\Domain\Clientes\Gestion\Http\Requests\ClienteRequest;
use App\Domain\Clientes\Gestion\Services\ClienteService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function __construct(
        protected ClienteService $clienteService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('clientes/Index', [
            'clientes' => $this->clienteService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('clientes/Create');
    }

    public function store(ClienteRequest $request)
    {
        $this->clienteService->create($request->validated());
        return redirect()->route('clientes.index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('clientes/Show', [
            'cliente' => $this->clienteService->getById($id),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('clientes/Edit', [
            'cliente' => $this->clienteService->getById($id),
        ]);
    }

    public function update(ClienteRequest $request, string $id)
    {
        $this->clienteService->update($id, $request->validated());
        return redirect()->route('clientes.index');
    }

    public function destroy(string $id)
    {
        $this->clienteService->delete($id);
        return redirect()->route('clientes.index');
    }
}
