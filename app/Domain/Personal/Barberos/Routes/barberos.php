<?php

use App\Domain\Personal\Barberos\Http\Controllers\BarberoController;
use App\Domain\Personal\Barberos\Http\Controllers\BarberoServicioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('barberos')->name('barberos.')
->group(function () {
    Route::get('/', [BarberoController::class, 'index'])->name('index');
    Route::get('/create', [BarberoController::class, 'create'])->name('create');
    Route::post('/', [BarberoController::class, 'store'])->name('store');
    Route::get('/{id}', [BarberoController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [BarberoController::class, 'edit'])->name('edit');
    Route::put('/{id}', [BarberoController::class, 'update'])->name('update');
    Route::delete('/{id}', [BarberoController::class, 'destroy'])->name('destroy');
    Route::post('/{barberoId}/servicios', [BarberoServicioController::class, 'sync'])->name('syncServicios');
});
