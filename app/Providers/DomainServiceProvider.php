<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Barberia
use App\Domain\Barberia\Gestion\Repositories\Contracts\BarberiaRepositoryInterface;
use App\Domain\Barberia\Gestion\Repositories\Eloquent\EloquentBarberiaRepository;

// Reservas / Citas
use App\Domain\Reservas\Citas\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Domain\Reservas\Citas\Repositories\Eloquent\EloquentAppointmentRepository;

// Personal / Barberos
use App\Domain\Personal\Barberos\Repositories\Contracts\BarberoRepositoryInterface;
use App\Domain\Personal\Barberos\Repositories\Eloquent\EloquentBarberoRepository;

// Catalogo / Servicios
use App\Domain\Catalogo\Servicios\Repositories\Contracts\ServicioRepositoryInterface;
use App\Domain\Catalogo\Servicios\Repositories\Eloquent\EloquentServicioRepository;

// Catalogo / Productos
use App\Domain\Catalogo\Productos\Repositories\Contracts\ProductoRepositoryInterface;
use App\Domain\Catalogo\Productos\Repositories\Eloquent\EloquentProductoRepository;

// Clientes
use App\Domain\Clientes\Gestion\Repositories\Contracts\ClienteRepositoryInterface;
use App\Domain\Clientes\Gestion\Repositories\Eloquent\EloquentClienteRepository;

// Ventas
use App\Domain\Ventas\Gestion\Repositories\Contracts\VentaRepositoryInterface;
use App\Domain\Ventas\Gestion\Repositories\Eloquent\EloquentVentaRepository;

// Configuracion / Horarios
use App\Domain\Configuracion\Horarios\Repositories\Contracts\HorarioBaseRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Eloquent\EloquentHorarioBaseRepository;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\BloqueoExcepcionRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Eloquent\EloquentBloqueoExcepcionRepository;
use App\Domain\Configuracion\Horarios\Repositories\Contracts\TurnoFijoRepositoryInterface;
use App\Domain\Configuracion\Horarios\Repositories\Eloquent\EloquentTurnoFijoRepository;

class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BarberiaRepositoryInterface::class, EloquentBarberiaRepository::class);
        $this->app->bind(AppointmentRepositoryInterface::class, EloquentAppointmentRepository::class);
        $this->app->bind(BarberoRepositoryInterface::class, EloquentBarberoRepository::class);
        $this->app->bind(ServicioRepositoryInterface::class, EloquentServicioRepository::class);
        $this->app->bind(ProductoRepositoryInterface::class, EloquentProductoRepository::class);
        $this->app->bind(ClienteRepositoryInterface::class, EloquentClienteRepository::class);
        $this->app->bind(VentaRepositoryInterface::class, EloquentVentaRepository::class);
        $this->app->bind(HorarioBaseRepositoryInterface::class, EloquentHorarioBaseRepository::class);
        $this->app->bind(BloqueoExcepcionRepositoryInterface::class, EloquentBloqueoExcepcionRepository::class);
        $this->app->bind(TurnoFijoRepositoryInterface::class, EloquentTurnoFijoRepository::class);
    }
}
