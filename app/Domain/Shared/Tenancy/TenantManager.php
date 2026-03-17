<?php

namespace App\Domain\Shared\Tenancy;

use App\Domain\Barberia\Gestion\Models\Barberia;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;

class TenantManager
{
    /**
     * Get the current tenant (barberia)
     */
    public function getTenant(): ?Barberia
    {
        if (!App::bound('tenant')) {
            return null;
        }

        return App::make('tenant');
    }

    /**
     * Set the current tenant
     */
    public function setTenant(Barberia $barberia): void
    {
        App::singleton('tenant', fn () => $barberia);
    }

    /**
     * Check if a tenant is set
     */
    public function hasTenant(): bool
    {
        return App::bound('tenant') && $this->getTenant() !== null;
    }

    /**
     * Get the tenant ID
     */
    public function getTenantId(): ?string
    {
        $tenant = $this->getTenant();

        return $tenant?->id;
    }

    /**
     * Get tenant configuration value
     */
    public function getConfig(string $key, mixed $default = null): mixed
    {
        $tenant = $this->getTenant();

        if (!$tenant) {
            return $default;
        }

        // Cache tenant config for performance
        $cacheKey = "tenant:{$tenant->id}:config:{$key}";

        return Cache::remember($cacheKey, 3600, function () use ($tenant, $key, $default) {
            return $tenant->getConfig($key) ?? $default;
        });
    }

    /**
     * Clear tenant context (useful for testing or logout)
     */
    public function clearTenant(): void
    {
        if (App::bound('tenant')) {
            App::forgetInstance('tenant');
        }
    }

    /**
     * Execute callback with a specific tenant context
     */
    public function withTenant(Barberia $barberia, callable $callback): mixed
    {
        $previousTenant = $this->getTenant();

        try {
            $this->setTenant($barberia);

            return $callback($barberia);
        } finally {
            // Restore previous tenant or clear if there was none
            if ($previousTenant) {
                $this->setTenant($previousTenant);
            } else {
                $this->clearTenant();
            }
        }
    }

    /**
     * Execute callback without tenant filtering (super-admin operations)
     */
    public function withoutTenant(callable $callback): mixed
    {
        $previousTenant = $this->getTenant();

        try {
            $this->clearTenant();

            return $callback();
        } finally {
            if ($previousTenant) {
                $this->setTenant($previousTenant);
            }
        }
    }
}
