<?php

use App\Domain\Clientes\Gestion\Http\Controllers\ClienteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('clientes')->name('clientes.')
->group(function () {
    Route::get('/', [ClienteController::class, 'index'])->name('index');
    Route::get('/create', [ClienteController::class, 'create'])->name('create');
    Route::post('/', [ClienteController::class, 'store'])->name('store');
    Route::get('/{id}', [ClienteController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [ClienteController::class, 'edit'])->name('edit');
    Route::put('/{id}', [ClienteController::class, 'update'])->name('update');
    Route::delete('/{id}', [ClienteController::class, 'destroy'])->name('destroy');
});
