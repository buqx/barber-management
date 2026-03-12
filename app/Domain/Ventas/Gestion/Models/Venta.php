<?php

namespace App\Domain\Ventas\Gestion\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Clientes\Gestion\Models\Cliente;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'ventas';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'barberia_id', 'cliente_id', 'total', 'utilidad_neta'];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(VentaDetalle::class, 'venta_id');
    }
}
