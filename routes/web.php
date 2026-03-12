<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// -- Domain routes ------------------------------------------------------------
require app_path('Domain/Barberia/Gestion/Routes/barberias.php');
require app_path('Domain/Reservas/Citas/Routes/booking.php');
require app_path('Domain/Settings/Perfil/Routes/settings.php');
