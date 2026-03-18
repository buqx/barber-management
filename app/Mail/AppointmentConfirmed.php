<?php

namespace App\Mail;

use App\Domain\Reservas\Citas\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmed extends Mailable
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
            subject: '¡Tu cita ha sido confirmada! - ' . $this->appointment->barberia->nombre,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-confirmed',
            with: [
                'appointment' => $this->appointment,
                'barberia' => $this->appointment->barberia,
                'cliente' => $this->appointment->cliente,
                'barbero' => $this->appointment->barbero,
            ],
        );
    }
}
