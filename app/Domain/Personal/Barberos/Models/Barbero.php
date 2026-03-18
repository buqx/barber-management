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
use Illuminate\Support\Str;

class Barbero extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'barberos';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id', 'barberia_id', 'user_id', 'nombre', 'email', 'slug',
        'cedula', 'foto_path', 'es_dueno', 'comision_porcentaje', 'activo', 'booking_publico',
    ];

    protected $appends = ['foto_url', 'booking_url'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($barbero) {
            if (empty($barbero->slug)) {
                $barbero->slug = Str::slug($barbero->nombre) . '-' . substr(Str::random(6), 0, 6);
            }
        });

        static::updating(function ($barbero) {
            if (empty($barbero->slug)) {
                $barbero->slug = Str::slug($barbero->nombre) . '-' . substr(Str::random(6), 0, 6);
            }
        });
    }

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

    protected function bookingUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->barberia
                ? url("/{$this->barberia->slug}/booking/{$this->slug}")
                : null
        );
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
