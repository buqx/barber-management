<?php

namespace App\Domain\Configuracion\Horarios\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class BloqueoExcepcion extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'bloqueos_excepciones';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barbero_id', 'fecha_inicio', 'fecha_fin', 'motivo', 'todo_el_dia',
    ];

    public function barbero(): BelongsTo
    {
        return $this->belongsTo(Barbero::class, 'barbero_id');
    }
}
