<?php

namespace App\Domain\Configuracion\Horarios\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BloqueoExcepcionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'barbero_id'   => ['required', 'uuid', 'exists:barberos,id'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin'    => ['required', 'date', 'after_or_equal:fecha_inicio'],
            'motivo'       => ['nullable', 'string', 'max:255'],
            'todo_el_dia'  => ['required', 'boolean'],
        ];
    }
}
