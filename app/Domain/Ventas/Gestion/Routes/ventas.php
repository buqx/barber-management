<?php

use App\Domain\Ventas\Gestion\Http\Controllers\VentaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('ventas')->name('ventas.')
->group(function () {
    Route::get('/', [VentaController::class, 'index'])->name('index');
    Route::get('/create', [VentaController::class, 'create'])->name('create');
    Route::post('/', [VentaController::class, 'store'])->name('store');
    Route::get('/{id}', [VentaController::class, 'show'])->name('show');
});
