<?php

namespace App\Jobs;

use App\Domain\Reservas\Citas\Models\Appointment;
use App\Mail\AppointmentNotificationToBarber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAppointmentNotificationToBarber implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Appointment $appointment
    ) {}

    public function handle(): void
    {
        $this->appointment->load(['cliente', 'barbero', 'barberia']);

        $email = $this->appointment->barbero->email;

        // Validar que el email sea válido
        if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Mail::to($email)->send(
                new AppointmentNotificationToBarber($this->appointment)
            );
        }
    }
}
