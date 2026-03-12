<?php

namespace App\Domain\Personal\Barberos\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BarberoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'               => ['required', 'string', 'max:255'],
            'email'                => ['nullable', 'email', 'max:255'],
            'barberia_id'          => ['required', 'uuid'],
            'es_dueno'             => ['boolean'],
            'comision_porcentaje'  => ['nullable', 'numeric', 'min:0', 'max:100'],
            'activo'               => ['boolean'],
        ];
    }
}
