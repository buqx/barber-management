<?php

namespace App\Domain\Configuracion\Horarios\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TurnoFijoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'barbero_id'  => ['sometimes', 'required', 'uuid', 'exists:barberos,id'],
            'cliente_id'  => ['required', 'uuid', 'exists:clientes,id'],
            'dia_semana'  => ['required', 'integer', 'min:0', 'max:6'],
            'hora_inicio' => ['required', 'date_format:H:i'],
            'servicios'   => ['required', 'array', 'min:1'],
            'servicios.*' => ['uuid', 'exists:servicios,id'],
            'activo'      => ['sometimes', 'boolean'],
        ];
    }
}
