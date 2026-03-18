<?php

namespace App\Mail;

use App\Domain\Reservas\Citas\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentNotificationToBarber extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Appointment $appointment
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address(
                address: $this->appointment->barberia->telefono ?? 'noreply@barberia.com',
                name: $this->appointment->barberia->nombre
            ),
            subject: 'Nueva cita pendiente por confirmar - ' . $this->appointment->barberia->nombre,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-notification-barber',
            with: [
                'appointment' => $this->appointment,
                'barberia' => $this->appointment->barberia,
                'cliente' => $this->appointment->cliente,
                'barbero' => $this->appointment->barbero,
            ],
        );
    }
}
