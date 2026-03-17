<?php

namespace App\Domain\Shared\Tenancy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * Trait for models that inherit tenant from a related model
 * (e.g., HorarioBase belongs to Barbero which has a barberia_id)
 *
 * Usage: Add this trait to models that don't have their own barberia_id
 * but should be filtered based on their parent's barberia_id
 */
trait HasTenantThroughRelation
{
    /**
     * Boot the trait
     */
    public static function bootHasTenantThroughRelation(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenant = self::getCurrentTenant();

            if ($tenant) {
                // Filter through the parent relation (barbero)
                $builder->whereHas('barbero', function ($query) use ($tenant) {
                    $query->where('barberia_id', $tenant->id);
                });
            }
        });
    }

    /**
     * Get the current tenant from the application container
     */
    public static function getCurrentTenantThroughRelation(): ?\App\Domain\Barberia\Gestion\Models\Barberia
    {
        if (App::bound('tenant')) {
            return App::make('tenant');
        }

        return null;
    }

    /**
     * Scope to get all records regardless of tenant
     */
    public function scopeWithoutTenantScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }
}
