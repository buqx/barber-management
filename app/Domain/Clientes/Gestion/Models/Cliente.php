<?php

namespace App\Domain\Clientes\Gestion\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'clientes';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'barberia_id', 'nombre', 'telefono', 'email'];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }
}
