<?php

namespace App\Domain\Configuracion\Horarios\Http\Controllers;

use App\Domain\Configuracion\Horarios\Http\Requests\BloqueoExcepcionRequest;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\BloqueoExcepcionRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;

class BloqueoExcepcionController extends Controller
{
    public function __construct(
        protected BloqueoExcepcionRepositoryInterface $bloqueoRepository,
    ) {}

    public function store(BloqueoExcepcionRequest $request): RedirectResponse
    {
        $this->bloqueoRepository->create($request->validated());

        return redirect()->back()->with('success', 'Bloqueo creado correctamente.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->bloqueoRepository->delete($id);

        return redirect()->back()->with('success', 'Bloqueo eliminado correctamente.');
    }
}
