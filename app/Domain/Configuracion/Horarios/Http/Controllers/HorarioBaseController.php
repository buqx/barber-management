<?php

namespace App\Domain\Configuracion\Horarios\Http\Controllers;

use App\Domain\Configuracion\Horarios\Http\Requests\HorarioBaseRequest;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;

class HorarioBaseController extends Controller
{
    public function __construct(
        protected HorarioBaseRepositoryInterface $horarioRepository,
    ) {}

    public function store(HorarioBaseRequest $request): RedirectResponse
    {
        $this->horarioRepository->create($request->validated());

        return redirect()->back()->with('success', 'Horario creado correctamente.');
    }

    public function update(HorarioBaseRequest $request, string $id): RedirectResponse
    {
        $this->horarioRepository->update($id, $request->validated());

        return redirect()->back()->with('success', 'Horario actualizado correctamente.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->horarioRepository->delete($id);

        return redirect()->back()->with('success', 'Horario eliminado correctamente.');
    }
}
