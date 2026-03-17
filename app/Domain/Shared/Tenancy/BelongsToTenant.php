<?php

namespace App\Domain\Shared\Tenancy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Schema;

trait BelongsToTenant
{
    /**
     * Boot the trait
     */
    public static function bootBelongsToTenant(): void
    {
        // Apply global scope for tenant filtering
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenant = self::getCurrentTenant();

            if ($tenant) {
                // If model has barberia_id column, filter by it
                if (Schema::hasColumn($builder->getModel()->getTable(), 'barberia_id')) {
                    $builder->where('barberia_id', $tenant->id);
                }
            }
        });

        // Auto-set barberia_id on creating if not provided
        static::creating(function ($model) {
            if (Schema::hasColumn($model->getTable(), 'barberia_id')) {
                // Only auto-assign if barberia_id is not being set explicitly
                // This allows admin operations that specify a different tenant
                if (empty($model->barberia_id)) {
                    $tenant = self::getCurrentTenant();

                    if ($tenant) {
                        $model->barberia_id = $tenant->id;
                    }
                }
            }
        });
    }

    /**
     * Get the current tenant from the application container
     */
    public static function getCurrentTenant(): ?\App\Domain\Barberia\Gestion\Models\Barberia
    {
        if (App::bound('tenant')) {
            return App::make('tenant');
        }

        return null;
    }

    /**
     * Check if a tenant context is currently active
     */
    public static function hasTenantContext(): bool
    {
        return App::bound('tenant') && self::getCurrentTenant() !== null;
    }

    /**
     * Scope to get all records regardless of tenant (for super-admin operations)
     */
    public function scopeWithoutTenant(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }

    /**
     * Scope to filter by a specific tenant
     */
    public function scopeForTenant(Builder $query, string $barberiaId): Builder
    {
        return $query->withoutGlobalScope('tenant')
            ->where('barberia_id', $barberiaId);
    }

    /**
     * Initialize the trait
     */
    public function initializeBelongsToTenant(): void
    {
        // Ensure barberia_id is cast to string (UUID)
        if (isset($this->casts['barberia_id'])) {
            return;
        }

        if (Schema::hasColumn($this->getTable(), 'barberia_id')) {
            $this->casts['barberia_id'] = 'string';
        }
    }
}
