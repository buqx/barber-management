<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Core\Tenancy\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Barbero extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'barberos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barberia_id', 'nombre', 'email', 'es_dueno', 'comision_porcentaje', 'activo',
    ];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }

    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'barbero_servicio', 'barbero_id', 'servicio_id');
    }

    /**
     * Devuelve el horario base para un día específico de la semana (0=Domingo, 6=Sábado)
     */
    public function horarioBaseParaDia(int $diaSemana)
    {
        return $this->hasMany(HorarioBase::class, 'barbero_id')
            ->where('dia_semana', $diaSemana)
            ->get();
    }
}
