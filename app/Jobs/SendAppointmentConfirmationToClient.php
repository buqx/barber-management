<?php

namespace App\Jobs;

use App\Domain\Reservas\Citas\Models\Appointment;
use App\Mail\AppointmentConfirmed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAppointmentConfirmationToClient implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Appointment $appointment
    ) {}

    public function handle(): void
    {
        $this->appointment->load(['cliente', 'barbero', 'barberia']);

        $email = $this->appointment->cliente->email;

        // Validar que el email sea válido: debe contener @ y un punto (dominio)
        // y no debe ser solo números/teléfono
        if ($email && is_string($email) && str_contains($email, '@') && str_contains($email, '.')) {
            // Verificar que no parezca un número de teléfono
            if (!preg_match('/^\+?[\d\s\-]{7,20}$/', $email)) {
                Mail::to($email)->send(
                    new AppointmentConfirmed($this->appointment)
                );
            }
        }
    }
}
