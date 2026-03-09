<?php

namespace App\Core\Tenancy;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use App\Infrastructure\Persistence\Barberia;

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
