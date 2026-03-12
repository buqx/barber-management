<?php

use App\Domain\Configuracion\Horarios\Http\Controllers\BloqueoExcepcionController;
use App\Domain\Configuracion\Horarios\Http\Controllers\HorarioBaseController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/horarios', [HorarioBaseController::class, 'store'])->name('horarios.store');
    Route::put('/horarios/{id}', [HorarioBaseController::class, 'update'])->name('horarios.update');
    Route::delete('/horarios/{id}', [HorarioBaseController::class, 'destroy'])->name('horarios.destroy');

    Route::post('/bloqueos', [BloqueoExcepcionController::class, 'store'])->name('bloqueos.store');
    Route::delete('/bloqueos/{id}', [BloqueoExcepcionController::class, 'destroy'])->name('bloqueos.destroy');
});
