<?php

namespace App\Domain\Ventas\Gestion\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Reservas\Citas\Models\Appointment;
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
    protected $fillable = [
        'id', 'barberia_id', 'cita_id', 'cliente_id', 'barbero_id',
        'tipo_origen', 'estado', 'subtotal', 'descuento', 'total', 'utilidad_neta', 'observaciones',
    ];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function cita(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'cita_id');
    }

    public function barbero(): BelongsTo
    {
        return $this->belongsTo(Barbero::class, 'barbero_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(VentaDetalle::class, 'venta_id');
    }
}
