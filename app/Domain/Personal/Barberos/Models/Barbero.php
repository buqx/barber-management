<?php

namespace App\Domain\Personal\Barberos\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Configuracion\Horarios\Models\HorarioBase;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class Barbero extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'barberos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barberia_id', 'nombre', 'email',
        'es_dueno', 'comision_porcentaje', 'activo',
    ];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }

    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'barbero_servicio', 'barbero_id', 'servicio_id');
    }

    public function horarioBaseParaDia(int $diaSemana): Collection
    {
        return $this->hasMany(HorarioBase::class, 'barbero_id')
            ->where('dia_semana', $diaSemana)
            ->get();
    }
}
