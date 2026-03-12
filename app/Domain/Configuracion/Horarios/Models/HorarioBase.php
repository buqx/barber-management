<?php

namespace App\Domain\Configuracion\Horarios\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class HorarioBase extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'horarios_base';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barbero_id', 'dia_semana',
        'hora_inicio', 'hora_fin',
        'almuerzo_inicio', 'almuerzo_fin',
    ];

    public function barbero(): BelongsTo
    {
        return $this->belongsTo(Barbero::class, 'barbero_id');
    }
}
