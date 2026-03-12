<?php

namespace App\Domain\Catalogo\Servicios\Models;

use App\Domain\Shared\Tenancy\BelongsToTenant;
use App\Domain\Barberia\Gestion\Models\Barberia;
use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasUuids, BelongsToTenant;

    protected $table = 'servicios';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['id', 'barberia_id', 'nombre', 'precio', 'duracion_minutos'];

    public function barberia(): BelongsTo
    {
        return $this->belongsTo(Barberia::class, 'barberia_id');
    }

    public function barberos(): BelongsToMany
    {
        return $this->belongsToMany(Barbero::class, 'barbero_servicio', 'servicio_id', 'barbero_id');
    }
}
