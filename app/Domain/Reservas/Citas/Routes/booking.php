<?php

use App\Domain\Reservas\Citas\Http\Controllers\BookingController;
use App\Domain\Shared\Tenancy\IdentifyTenant;
use Illuminate\Support\Facades\Route;

Route::prefix('{tenant}')
    ->middleware([IdentifyTenant::class])
    ->group(function () {
        // Booking general de la barbería
        Route::get('booking', [BookingController::class, 'showStep1'])->name('booking.step1');

        // Booking específico de un barbero
        Route::get('booking/{barbero}', [BookingController::class, 'showStep1'])
            ->name('booking.barbero');

        // API routes
        Route::post('booking/check-availability', [BookingController::class, 'checkAvailability'])->name('booking.checkAvailability');
        Route::post('booking/confirm', [BookingController::class, 'confirm'])->name('booking.confirm');
    });
