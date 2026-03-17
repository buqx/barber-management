<?php

namespace App\Domain\Shared\Tenancy;

use App\Domain\Barberia\Gestion\Models\Barberia;
use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

class TenantServiceProvider extends ServiceProvider
{
    /**
     * Register services
     */
    public function register(): void
    {
        // Bind the tenant singleton
        $this->app->singleton('tenant', function ($app) {
            return null;
        });

        // Helper function to get current tenant
        $this->app->singleton(TenantManager::class);
    }

    /**
     * Bootstrap services
     */
    public function boot(): void
    {
        //
    }
}
