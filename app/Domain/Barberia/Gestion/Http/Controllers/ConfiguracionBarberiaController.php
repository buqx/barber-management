<?php

namespace App\Domain\Barberia\Gestion\Http\Controllers;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguracionBarberiaController extends Controller
{
    /**
     * Mostrar la configuración de la barbería del usuario actual
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Buscar barbero por email del usuario
        $barbero = Barbero::where('email', $user->email)
            ->where('es_dueno', true)
            ->first();

        if (!$barbero) {
            return Inertia::render('barberias/Configuracion', [
                'barberia' => null,
                'error' => 'No tienes una barbería asignada como dueño.',
            ]);
        }

        $barberia = Barberia::find($barbero->barberia_id);

        return Inertia::render('barberias/Configuracion', [
            'barberia' => $barberia,
            'barbero' => $barbero,
        ]);
    }

    /**
     * Actualizar la configuración de la barbería
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        // Verificar que el usuario es dueño de la barbería
        $barbero = Barbero::where('email', $user->email)
            ->where('es_dueno', true)
            ->where('barberia_id', $id)
            ->first();

        if (!$barbero) {
            abort(403, 'No tienes permisos para editar esta barbería.');
        }

        $barberia = Barberia::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:barberias,slug,' . $id,
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'horario_atencion' => 'nullable|string',
            'color_primario' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'color_secundario' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'moneda' => 'nullable|string|size:3',
            'timezone' => 'nullable|string|max:64',
            'booking_habilitado' => 'nullable|boolean',
            'dias_anticipacion' => 'nullable|integer|min:1|max:365',
            'intervalo_citas' => 'nullable|integer|min:15|max:120',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        // Manejar logo
        if ($request->hasFile('logo')) {
            // Eliminar logo anterior si existe
            if ($barberia->logo_url) {
                Storage::disk('public')->delete($barberia->logo_url);
            }
            $validated['logo_url'] = $request->file('logo')->store('barberias/logos', 'public');
        }

        // Manejar banner
        if ($request->hasFile('banner')) {
            // Eliminar banner anterior si existe
            if ($barberia->banner_url) {
                Storage::disk('public')->delete($barberia->banner_url);
            }
            $validated['banner_url'] = $request->file('banner')->store('barberias/banners', 'public');
        }

        // Convertir valores boleanos
        $validated['booking_habilitado'] = $request->boolean('booking_habilitado', true);

        $barberia->update($validated);

        return back()->with('success', 'Configuración guardada correctamente.');
    }

    /**
     * Ver preview del booking público
     */
    public function preview(string $id): Response
    {
        $user = Auth::user();

        // Verificar que el usuario es dueño de la barbería
        $barbero = Barbero::where('email', $user->email)
            ->where('es_dueno', true)
            ->where('barberia_id', $id)
            ->first();

        if (!$barbero) {
            abort(403, 'No tienes permisos para ver esta barbería.');
        }

        $barberia = Barberia::findOrFail($id);

        // Simular el contexto de tenant para el booking
        app()->singleton('tenant', fn() => $barberia);

        return Inertia::render('barberias/Preview', [
            'barberia' => $barberia,
            'previewUrl' => '/' . $barberia->slug . '/booking',
        ]);
    }
}
