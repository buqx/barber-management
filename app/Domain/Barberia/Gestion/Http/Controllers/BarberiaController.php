<?php

namespace App\Domain\Barberia\Gestion\Http\Controllers;

use App\Domain\Barberia\Gestion\Http\Requests\BarberiaRequest;
use App\Domain\Barberia\Gestion\Services\BarberiaService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BarberiaController extends Controller
{
    public function __construct(
        protected BarberiaService $barberiaService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('barberias/Index', [
            'barberias' => $this->barberiaService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('barberias/Create');
    }

    public function store(BarberiaRequest $request)
    {
        $this->barberiaService->create($request->validated());
        return redirect()->route('barberias.index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('barberias/Show', [
            'barberia' => $this->barberiaService->getById($id),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('barberias/Edit', [
            'barberia' => $this->barberiaService->getById($id),
        ]);
    }

    public function update(BarberiaRequest $request, string $id)
    {
        $this->barberiaService->update($id, $request->validated());
        return redirect()->route('barberias.index');
    }

    public function destroy(string $id)
    {
        $this->barberiaService->delete($id);
        return redirect()->route('barberias.index');
    }
}
