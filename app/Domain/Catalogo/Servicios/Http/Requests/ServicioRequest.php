<?php

namespace App\Domain\Catalogo\Servicios\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'           => ['required', 'string', 'max:255'],
            'precio'           => ['required', 'numeric', 'min:0'],
            'duracion_minutos' => ['required', 'integer', 'min:1'],
            'barberia_id'      => ['required', 'uuid'],
        ];
    }
}
