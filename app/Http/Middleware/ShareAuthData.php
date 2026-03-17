<?php

namespace App\Http\Middleware;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareAuthData
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Determinar si es admin global
            $isGlobalAdmin = $user->is_admin === true;

            // Obtener la barbería del usuario (si es dueño o barbero)
            $barberiaId = null;
            $isOwner = false;

            if (!$isGlobalAdmin) {
                $barbero = Barbero::where('email', $user->email)->first();
                if ($barbero) {
                    $barberiaId = $barbero->barberia_id;
                    $isOwner = $barbero->es_dueno;
                }
            }

            Inertia::share('auth', [
                'user' => $user,
                'is_global_admin' => $isGlobalAdmin,
                'barberia_id' => $barberiaId,
                'is_owner' => $isOwner,
            ]);
        }

        return $next($request);
    }
}
