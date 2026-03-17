<?php

namespace App\Domain\Shared\Tenancy;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Support\Facades\Auth;

/**
 * Trait para agregar funcionalidad de tenant a los controladores
 */
trait TenantScope
{
    /**
     * Obtener la barbería del usuario actual (dueño o barbero)
     */
    protected function getCurrentBarberia(): ?Barberia
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        // Si es admin global, puede ver todo (retorna null para indicar "todos")
        if ($user->is_admin) {
            return null;
        }

        // Buscar si el usuario es un barbero
        $barbero = Barbero::where('email', $user->email)->first();

        if (!$barbero) {
            return null;
        }

        return $barbero->barberia;
    }

    /**
     * Obtener el ID de la barbería del usuario actual
     */
    protected function getCurrentBarberiaId(): ?string
    {
        $barberia = $this->getCurrentBarberia();

        return $barberia?->id;
    }

    /**
     * Verificar si el usuario actual es admin global
     */
    protected function isGlobalAdmin(): bool
    {
        $user = Auth::user();

        return $user && $user->is_admin === true;
    }

    /**
     * Verificar si el usuario actual es dueño de una barbería
     */
    protected function isBarberiaOwner(): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        $barbero = Barbero::where('email', $user->email)
            ->where('es_dueno', true)
            ->first();

        return $barbero !== null;
    }

    /**
     * Obtener el barbero del usuario actual
     */
    protected function getCurrentBarbero(): ?Barbero
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        return Barbero::where('email', $user->email)->first();
    }

    /**
     * Obtener la barbería del usuario, si es admin global retorna todas (null)
     */
    protected function getBarberiaIdOrNull(): ?string
    {
        if ($this->isGlobalAdmin()) {
            return null; // null significa "todas las barberías"
        }

        return $this->getCurrentBarberiaId();
    }
}
