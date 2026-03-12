<?php

namespace App\Domain\Shared\Tenancy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            $tenant = App::make('tenant', fn () => null);
            if ($tenant) {
                $builder->where('barberia_id', $tenant->id);
            }
        });
    }

    public function initializeBelongsToTenant(): void
    {
        if (!isset($this->casts['barberia_id'])) {
            $this->casts['barberia_id'] = 'string';
        }
    }
}
