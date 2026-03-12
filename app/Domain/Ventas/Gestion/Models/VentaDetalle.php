<?php

namespace App\Domain\Ventas\Gestion\Models;

use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Catalogo\Productos\Models\Producto;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    use HasUuids;

    protected $table = 'venta_detalles';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'venta_id', 'tipo_item', 'servicio_id', 'producto_id',
        'descripcion', 'cantidad', 'precio_venta', 'precio_costo', 'subtotal', 'utilidad_neta',
    ];

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
