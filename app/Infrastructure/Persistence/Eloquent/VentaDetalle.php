<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Core\Tenancy\BelongsToTenant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaDetalle extends Model
{


    protected static function booted()
    {
        static::created(function ($detalle) {
            // Suponiendo que cada servicio tiene un producto asociado (ajustar según tu lógica)
            $productoId = $detalle->servicio->producto_id ?? null;
            if ($productoId) {
                $producto = Producto::find($productoId);
                if ($producto && $producto->stock_actual > 0) {
                    $producto->decrement('stock_actual');
                }
            }
        });
    }
    use HasUuids, BelongsToTenant;

    protected $table = 'venta_detalles';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'venta_id', 'servicio_id', 'precio_venta', 'precio_costo', 'utilidad_neta',
    ];

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
