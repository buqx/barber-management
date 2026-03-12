<?php

namespace App\Domain\Personal\Barberos\Http\Controllers;

use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class BarberoServicioController extends Controller
{
    public function sync(string $barberoId, Request $request): RedirectResponse
    {
        $request->validate([
            'servicio_ids'   => ['present', 'array'],
            'servicio_ids.*' => ['uuid', 'exists:servicios,id'],
        ]);

        $barbero = Barbero::findOrFail($barberoId);
        $barbero->servicios()->sync($request->servicio_ids);

        return redirect()->back()->with('success', 'Servicios actualizados correctamente.');
    }
}
