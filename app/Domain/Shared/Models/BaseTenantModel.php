<?php

namespace App\Domain\Shared\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Domain\Shared\Tenancy\BelongsToTenant;

abstract class BaseTenantModel extends Model
{
    use HasUuids, BelongsToTenant;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
