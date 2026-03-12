<?php

namespace App\Domain\Reservas\Citas\Notifications;

use App\Domain\Reservas\Citas\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentBooked extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Appointment $appointment,
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Cita Confirmada')
            ->greeting('¡Tu cita ha sido confirmada!')
            ->line('Detalles:')
            ->line('Barbero: ' . $this->appointment->barbero->nombre)
            ->line('Fecha: ' . $this->appointment->inicio_at)
            ->line('Gracias por reservar con nosotros.');
    }
}
