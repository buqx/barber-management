<?php

namespace App\Domain\Ventas\Gestion\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Catalogo\Productos\Models\Producto;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'venta_detalles';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'venta_id', 'servicio_id',
        'precio_venta', 'precio_costo', 'utilidad_neta',
    ];

    protected static function booted(): void
    {
        static::created(function (self $detalle) {
            /** @var Servicio|null $servicio */
            $servicio   = $detalle->servicio;
            $productoId = $servicio->producto_id ?? null;

            if ($productoId) {
                $producto = Producto::find($productoId);
                if ($producto && $producto->stock_actual > 0) {
                    $producto->decrement('stock_actual');
                }
            }
        });
    }

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
