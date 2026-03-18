<?php

namespace App\Domain\Configuracion\Horarios\Models;

use App\Domain\Personal\Barberos\Models\Barbero;
use App\Domain\Clientes\Gestion\Models\Cliente;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Shared\Tenancy\HasTenantThroughRelation;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class TurnoFijo extends Model
{
    use HasUuids, HasTenantThroughRelation;

    protected $table = 'turnos_fijos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id',
        'barbero_id',
        'cliente_id',
        'dia_semana',
        'hora_inicio',
        'activo',
    ];

    protected $casts = [
        'dia_semana' => 'integer',
        'activo' => 'boolean',
        'hora_inicio' => 'datetime:H:i',
    ];

    public function barbero(): BelongsTo
    {
        return $this->belongsTo(Barbero::class, 'barbero_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function servicios(): BelongsToMany
    {
        return $this->belongsToMany(Servicio::class, 'turnos_fijos_servicios', 'turno_fijo_id', 'servicio_id');
    }

    /**
     * Obtener la duración total de los servicios en minutos
     */
    public function getDuracionTotalAttribute(): int
    {
        return $this->servicios->sum('duracion_minutos');
    }

    /**
     * Obtener nombre del día de la semana
     */
    public function getDiaSemanaNombreAttribute(): string
    {
        $dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return $dias[$this->dia_semana] ?? '';
    }
}
