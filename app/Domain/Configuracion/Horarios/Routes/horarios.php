<?php

use App\Domain\Configuracion\Horarios\Http\Controllers\BloqueoExcepcionController;
use App\Domain\Configuracion\Horarios\Http\Controllers\HorarioBaseController;
use App\Domain\Configuracion\Horarios\Http\Controllers\TurnoFijoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/horarios', [HorarioBaseController::class, 'store'])->name('horarios.store');
    Route::put('/horarios/{id}', [HorarioBaseController::class, 'update'])->name('horarios.update');
    Route::delete('/horarios/{id}', [HorarioBaseController::class, 'destroy'])->name('horarios.destroy');

    Route::post('/bloqueos', [BloqueoExcepcionController::class, 'store'])->name('bloqueos.store');
    Route::delete('/bloqueos/{id}', [BloqueoExcepcionController::class, 'destroy'])->name('bloqueos.destroy');

    // Turnos fijos
    Route::get('/turnos-fijos', [TurnoFijoController::class, 'index'])->name('turnos-fijos.index');
    Route::post('/turnos-fijos', [TurnoFijoController::class, 'store'])->name('turnos-fijos.store');
    Route::put('/turnos-fijos/{id}', [TurnoFijoController::class, 'update'])->name('turnos-fijos.update');
    Route::delete('/turnos-fijos/{id}', [TurnoFijoController::class, 'destroy'])->name('turnos-fijos.destroy');
    Route::get('/turnos-fijos/barbero/{barberoId}', [TurnoFijoController::class, 'byBarbero'])->name('turnos-fijos.byBarbero');
});
