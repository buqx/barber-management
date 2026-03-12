<?php

namespace App\Domain\Personal\Barberos\Http\Controllers;

use App\Domain\Personal\Barberos\Http\Requests\BarberoRequest;
use App\Domain\Personal\Barberos\Services\BarberoService;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BarberoController extends Controller
{
    public function __construct(
        protected BarberoService $barberoService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('barberos/Index', [
            'barberos' => $this->barberoService->getAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('barberos/Create');
    }

    public function store(BarberoRequest $request)
    {
        $this->barberoService->create($request->validated());
        return redirect()->route('barberos.index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('barberos/Show', [
            'barbero' => $this->barberoService->getById($id),
        ]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('barberos/Edit', [
            'barbero' => $this->barberoService->getById($id),
        ]);
    }

    public function update(BarberoRequest $request, string $id)
    {
        $this->barberoService->update($id, $request->validated());
        return redirect()->route('barberos.index');
    }

    public function destroy(string $id)
    {
        $this->barberoService->delete($id);
        return redirect()->route('barberos.index');
    }
}
