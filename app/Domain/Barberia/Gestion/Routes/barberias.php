<?php

use App\Domain\Barberia\Gestion\Http\Controllers\BarberiaController;
use App\Domain\Barberia\Gestion\Http\Controllers\ConfiguracionBarberiaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('barberias')->name('barberias.')->group(function () {
    Route::get('/', [BarberiaController::class, 'index'])->name('index');
    Route::get('/create', [BarberiaController::class, 'create'])->name('create');
    Route::post('/', [BarberiaController::class, 'store'])->name('store');
    Route::get('/{id}', [BarberiaController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [BarberiaController::class, 'edit'])->name('edit');
    Route::put('/{id}', [BarberiaController::class, 'update'])->name('update');
    Route::delete('/{id}', [BarberiaController::class, 'destroy'])->name('destroy');
});

// Rutas de configuración (para el dueño de barbería)
Route::middleware(['auth', 'verified'])->prefix('configuracion')->name('configuracion.')->group(function () {
    Route::get('/mi-barberia', [ConfiguracionBarberiaController::class, 'index'])->name('index');
    Route::put('/mi-barberia', [ConfiguracionBarberiaController::class, 'update'])->name('update');
    Route::get('/mi-barberia/preview/{id}', [ConfiguracionBarberiaController::class, 'preview'])->name('preview');
});
