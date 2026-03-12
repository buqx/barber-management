<?php

namespace App\Domain\Barberia\Gestion\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BarberiaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $barberiaId = $this->route('id');

        return [
            'nombre'   => ['required', 'string', 'max:255'],
            'slug'     => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-]+$/',
                $barberiaId
                    ? Rule::unique('barberias', 'slug')->ignore($barberiaId)
                    : Rule::unique('barberias', 'slug'),
            ],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'moneda'   => ['required', 'string', 'size:3'],
            'timezone' => ['required', 'string', 'max:64'],
        ];
    }
}
