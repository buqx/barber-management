<?php

namespace App\Domain\Reservas\Citas\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Clientes\Gestion\Models\Cliente;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'citas';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barberia_id', 'barbero_id', 'cliente_id',
        'inicio_at', 'fin_at', 'estado', 'total_pagado',
    ];

    public function barbero(): BelongsTo
    {
        return $this->belongsTo(Barbero::class, 'barbero_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }
}
