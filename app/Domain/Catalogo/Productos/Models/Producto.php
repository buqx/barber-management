<?php

namespace App\Domain\Catalogo\Productos\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasUuids;

    protected $table = 'productos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'nombre', 'stock_actual', 'precio_costo', 'precio_venta'];
}
