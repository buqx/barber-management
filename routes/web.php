<?php

use App\Http\Controllers\DashboardController;
use App\Mail\TestEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Test route for sending emails (remove in production)
Route::get('/test-email', function () {
    try {
        Mail::to('vjuanesteban569@gmail.com')->send(new TestEmail());
        return response()->json(['success' => true, 'message' => 'Correo enviado exitosamente']);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
})->name('test-email');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// -- Domain routes ------------------------------------------------------------
require app_path('Domain/Barberia/Gestion/Routes/barberias.php');
require app_path('Domain/Personal/Barberos/Routes/barberos.php');
require app_path('Domain/Reservas/Citas/Routes/citas.php');
require app_path('Domain/Reservas/Citas/Routes/booking.php');
require app_path('Domain/Clientes/Gestion/Routes/clientes.php');
require app_path('Domain/Catalogo/Servicios/Routes/servicios.php');
require app_path('Domain/Catalogo/Productos/Routes/productos.php');
require app_path('Domain/Ventas/Gestion/Routes/ventas.php');
require app_path('Domain/Settings/Perfil/Routes/settings.php');
require app_path('Domain/Configuracion/Horarios/Routes/horarios.php');
require app_path('Domain/Reservas/Citas/Routes/agenda.php');
