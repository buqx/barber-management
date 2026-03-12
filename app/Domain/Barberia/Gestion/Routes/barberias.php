<?php

use App\Domain\Barberia\Gestion\Http\Controllers\BarberiaController;
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
