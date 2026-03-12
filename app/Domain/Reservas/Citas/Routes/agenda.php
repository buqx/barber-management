<?php

use App\Domain\Reservas\Citas\Http\Controllers\AgendaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('agenda')->name('agenda.')
    ->group(function () {
        Route::get('/', [AgendaController::class, 'index'])->name('index');
        Route::post('/check-disponibilidad', [AgendaController::class, 'checkDisponibilidad'])->name('checkDisponibilidad');
        Route::post('/citas', [AgendaController::class, 'store'])->name('store');
        Route::patch('/citas/{id}/estado', [AgendaController::class, 'updateEstado'])->name('updateEstado');
    });
