<?php

namespace App\Domain\Shared\Tenancy;

use App\Domain\Barberia\Gestion\Models\Barberia;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $slug = $request->route('tenant');

        if (!$slug) {
            return $next($request);
        }

        $barberia = Barberia::where('slug', $slug)->first();

        if (!$barberia) {
            abort(404, 'Barbería no encontrada');
        }

        // Set tenant in container
        App::singleton('tenant', fn () => $barberia);

        return $next($request);
    }
}
