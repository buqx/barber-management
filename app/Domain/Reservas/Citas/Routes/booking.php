<?php

use App\Domain\Reservas\Citas\Http\Controllers\BookingController;
use App\Domain\Shared\Tenancy\IdentifyTenant;
use Illuminate\Support\Facades\Route;

Route::prefix('{tenant}')
    ->middleware([IdentifyTenant::class])
    ->group(function () {
        Route::get('booking', [BookingController::class, 'showStep1'])->name('booking.step1');
        Route::post('booking/check-availability', [BookingController::class, 'checkAvailability'])->name('booking.checkAvailability');
    });
