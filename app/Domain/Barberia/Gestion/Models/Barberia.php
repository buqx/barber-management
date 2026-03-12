<?php

namespace App\Domain\Barberia\Gestion\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Barberia extends Model
{
    use HasUuids;

    protected $table = 'barberias';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'nombre', 'slug', 'logo_url', 'moneda', 'timezone'];
}
