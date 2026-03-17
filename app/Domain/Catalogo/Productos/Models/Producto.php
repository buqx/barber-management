<?php

namespace App\Domain\Catalogo\Productos\Models;

use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Shared\Tenancy\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'productos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id',
        'barberia_id',
        'nombre',
        'stock_actual',
        'precio_costo',
        'precio_venta',
    ];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }
}
