<?php

namespace App\Domain\Reservas\Citas\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'barber_id'     => ['required', 'uuid', 'exists:barberos,id'],
            'service_ids'   => ['required', 'array', 'min:1'],
            'service_ids.*' => ['uuid', 'exists:servicios,id'],
            'date'          => ['required', 'date'],
            'slot_inicio'   => ['required', 'date_format:H:i'],
            'slot_fin'      => ['required', 'date_format:H:i'],
            'cliente_nombre' => ['required', 'string', 'max:255'],
            'cliente_email' => ['required', 'email', 'max:255'],
            'cliente_telefono' => ['nullable', 'string', 'max:20'],
        ];
    }
}
