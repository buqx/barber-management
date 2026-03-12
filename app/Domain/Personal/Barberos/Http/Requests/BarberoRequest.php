<?php

namespace App\Domain\Personal\Barberos\Http\Requests;

use App\Domain\Personal\Barberos\Models\Barbero;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BarberoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $barberoId = $this->route('id');
        $barbero = $barberoId ? Barbero::find($barberoId) : null;

        return [
            'nombre'               => ['required', 'string', 'max:255'],
            'email'                => [
                'required',
                'email',
                'max:255',
                Rule::unique('barberos', 'email')->ignore($barberoId),
                Rule::unique('users', 'email')->ignore($barbero?->user_id),
            ],
            'cedula'               => [
                'required',
                'string',
                'max:50',
                Rule::unique('barberos', 'cedula')->ignore($barberoId),
            ],
            'foto'                 => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'barberia_id'          => ['required', 'uuid', 'exists:barberias,id'],
            'es_dueno'             => ['boolean'],
            'comision_porcentaje'  => ['nullable', 'numeric', 'min:0', 'max:100'],
            'activo'               => ['boolean'],
        ];
    }
}
