<?php

use App\Domain\Reservas\Citas\Http\Controllers\CitaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('citas')->name('citas.')
->group(function () {
    Route::get('/', [CitaController::class, 'index'])->name('index');
    Route::get('/{id}', [CitaController::class, 'show'])->name('show');
});
