<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Infrastructure\Persistence\Eloquent\Appointment;

class AppointmentBooked extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

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
