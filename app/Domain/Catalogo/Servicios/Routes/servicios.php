<?php

use App\Domain\Catalogo\Servicios\Http\Controllers\ServicioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('servicios')->name('servicios.')
->group(function () {
    Route::get('/', [ServicioController::class, 'index'])->name('index');
    Route::get('/create', [ServicioController::class, 'create'])->name('create');
    Route::post('/', [ServicioController::class, 'store'])->name('store');
    Route::get('/{id}', [ServicioController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [ServicioController::class, 'edit'])->name('edit');
    Route::put('/{id}', [ServicioController::class, 'update'])->name('update');
    Route::delete('/{id}', [ServicioController::class, 'destroy'])->name('destroy');
});
