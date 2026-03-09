<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Producto extends Model
{
    use HasUuids;

    protected $table = 'productos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'nombre', 'stock_actual', 'precio_costo', 'precio_venta',
    ];
}
