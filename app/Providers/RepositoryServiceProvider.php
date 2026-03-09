<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Core\Appointments\Contracts\AppointmentRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\EloquentAppointmentRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AppointmentRepositoryInterface::class,
            EloquentAppointmentRepository::class
        );
    }
}
