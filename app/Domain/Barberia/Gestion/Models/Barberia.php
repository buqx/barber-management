<?php

namespace App\Domain\Barberia\Gestion\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Barberia extends Model
{
    use HasUuids;

    protected $table = 'barberias';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nombre',
        'slug',
        'logo_url',
        'color_primario',
        'color_secundario',
        'banner_url',
        'descripcion',
        'telefono',
        'direccion',
        'facebook_url',
        'instagram_url',
        'horario_atencion',
        'moneda',
        'timezone',
        'booking_habilitado',
        'dias_anticipacion',
        'intervalo_citas',
    ];

    protected $casts = [
        'booking_habilitado' => 'boolean',
        'dias_anticipacion' => 'integer',
        'intervalo_citas' => 'integer',
    ];

    protected $appends = ['logo_url_final', 'banner_url_final'];

    /**
     * Relaciones
     */
    public function barberos(): HasMany
    {
        return $this->hasMany(\App\Domain\Personal\Barberos\Models\Barbero::class, 'barberia_id');
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(\App\Domain\Clientes\Gestion\Models\Cliente::class, 'barberia_id');
    }

    public function servicios(): HasMany
    {
        return $this->hasMany(\App\Domain\Catalogo\Servicios\Models\Servicio::class, 'barberia_id');
    }

    public function productos(): HasMany
    {
        return $this->hasMany(\App\Domain\Catalogo\Productos\Models\Producto::class, 'barberia_id');
    }

    public function citas(): HasMany
    {
        return $this->hasMany(\App\Domain\Reservas\Citas\Models\Appointment::class, 'barberia_id');
    }

    public function ventas(): HasMany
    {
        return $this->hasMany(\App\Domain\Ventas\Gestion\Models\Venta::class, 'barberia_id');
    }

    /**
     * Accesores para URLs de imágenes
     */
    public function getLogoUrlFinalAttribute(): ?string
    {
        if (!$this->logo_url) {
            return null;
        }

        if (filter_var($this->logo_url, FILTER_VALIDATE_URL)) {
            return $this->logo_url;
        }

        return Storage::disk('public')->url($this->logo_url);
    }

    public function getBannerUrlFinalAttribute(): ?string
    {
        if (!$this->banner_url) {
            return null;
        }

        if (filter_var($this->banner_url, FILTER_VALIDATE_URL)) {
            return $this->banner_url;
        }

        return Storage::disk('public')->url($this->banner_url);
    }

    /**
     * Obtener el color primario en formato CSS
     */
    public function getColorPrimarioCssAttribute(): string
    {
        return $this->color_primario ?? '#1a1a1a';
    }

    /**
     * Obtener el color secundario en formato CSS
     */
    public function getColorSecundarioCssAttribute(): string
    {
        return $this->color_secundario ?? '#f5f5f5';
    }

    /**
     * Generar estilos CSS dinámicos para la barbería
     */
    public function getCustomCssAttribute(): string
    {
        $primary = $this->color_primario ?? '#1a1a1a';
        $secondary = $this->color_secundario ?? '#f5f5f5';

        return <<<CSS
            :root {
                --barber-primary: {$primary};
                --barber-secondary: {$secondary};
                --barber-primary-rgb: {$this->hexToRgb($primary)};
            }
        CSS;
    }

    /**
     * Convertir hex a RGB
     */
    protected function hexToRgb(string $hex): string
    {
        $hex = ltrim($hex, '#');
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        return "{$r}, {$g}, {$b}";
    }

    /**
     * Verificar si el booking está habilitado
     */
    public function isBookingActivo(): bool
    {
        return $this->booking_habilitado ?? true;
    }

    /**
     * Obtener configuración de booking
     */
    public function getConfiguracionBooking(): array
    {
        return [
            'habilitado' => $this->booking_habilitado ?? true,
            'dias_anticipacion' => $this->dias_anticipacion ?? 30,
            'intervalo_citas' => $this->intervalo_citas ?? 30,
        ];
    }
}
