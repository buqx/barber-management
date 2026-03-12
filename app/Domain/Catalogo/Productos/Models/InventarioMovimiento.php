<?php

namespace App\Domain\Catalogo\Productos\Models;

use App\Domain\Ventas\Gestion\Models\Venta;
use App\Domain\Ventas\Gestion\Models\VentaDetalle;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventarioMovimiento extends Model
{
    use HasUuids;

    protected $table = 'inventario_movimientos';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'producto_id',
        'venta_id',
        'venta_detalle_id',
        'tipo',
        'cantidad',
        'stock_anterior',
        'stock_posterior',
        'observaciones',
    ];

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    public function detalle(): BelongsTo
    {
        return $this->belongsTo(VentaDetalle::class, 'venta_detalle_id');
    }
}