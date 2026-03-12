<?php

namespace App\Domain\Personal\Barberos\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Catalogo\Servicios\Models\Servicio;
use App\Domain\Configuracion\Horarios\Models\HorarioBase;
use App\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Barbero extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'barberos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barberia_id', 'user_id', 'nombre', 'email',
        'cedula', 'foto_path', 'es_dueno', 'comision_porcentaje', 'activo',
    ];

    protected $appends = ['foto_url'];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
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

    protected function fotoUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->foto_path ? Storage::disk('public')->url($this->foto_path) : null,
        );
    }
}
