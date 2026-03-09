<?php

namespace App\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Core\Tenancy\BelongsToTenant;

class BaseTenantModel extends Model
{
    use HasUuids, BelongsToTenant;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
