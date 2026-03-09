<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

use App\Http\Controllers\BookingController;

Route::prefix('{tenant}')->group(function () {
    Route::get('booking', [BookingController::class, 'showStep1'])->name('booking.step1');
    Route::post('booking/check-availability', [BookingController::class, 'checkAvailability'])->name('booking.checkAvailability');
});

require __DIR__.'/settings.php';
