<?php

namespace App\Domain\Shared\Tenancy;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use App\Domain\Barberia\Gestion\Models\Barberia;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $slug = $request->route('tenant');
        $barberia = Barberia::where('slug', $slug)->first();

        if (!$barberia) {
            abort(404, 'Barbería no encontrada');
        }

        App::singleton('tenant', fn () => $barberia);

        return $next($request);
    }
}
