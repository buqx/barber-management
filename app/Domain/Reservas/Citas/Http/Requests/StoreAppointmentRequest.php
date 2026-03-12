<?php

namespace App\Domain\Reservas\Citas\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
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
        ];
    }
}
