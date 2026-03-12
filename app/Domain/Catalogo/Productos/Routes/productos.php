<?php

use App\Domain\Catalogo\Productos\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('productos')->name('productos.')
->group(function () {
    Route::get('/', [ProductoController::class, 'index'])->name('index');
    Route::get('/create', [ProductoController::class, 'create'])->name('create');
    Route::post('/', [ProductoController::class, 'store'])->name('store');
    Route::get('/{id}', [ProductoController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [ProductoController::class, 'edit'])->name('edit');
    Route::put('/{id}', [ProductoController::class, 'update'])->name('update');
    Route::delete('/{id}', [ProductoController::class, 'destroy'])->name('destroy');
});
