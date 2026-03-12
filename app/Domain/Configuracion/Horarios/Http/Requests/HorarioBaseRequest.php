<?php

namespace App\Domain\Configuracion\Horarios\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HorarioBaseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'barbero_id'      => ['sometimes', 'required', 'uuid', 'exists:barberos,id'],
            'dia_semana'      => ['required', 'integer', 'min:0', 'max:6'],
            'hora_inicio'     => ['required', 'date_format:H:i'],
            'hora_fin'        => ['required', 'date_format:H:i', 'after:hora_inicio'],
            'almuerzo_inicio' => ['nullable', 'date_format:H:i'],
            'almuerzo_fin'    => ['nullable', 'date_format:H:i', 'after:almuerzo_inicio'],
        ];
    }
}
