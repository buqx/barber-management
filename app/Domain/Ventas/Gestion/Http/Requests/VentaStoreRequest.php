<?php

namespace App\Domain\Ventas\Gestion\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class VentaStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cita_id' => ['nullable', 'uuid', 'exists:citas,id'],
            'barbero_id' => ['nullable', 'uuid', 'exists:barberos,id'],
            'cliente_id' => ['nullable', 'uuid', 'exists:clientes,id'],
            'cliente_nombre' => ['nullable', 'string', 'max:255'],
            'cliente_email' => ['nullable', 'email', 'max:255'],
            'cliente_telefono' => ['nullable', 'string', 'max:50'],
            'servicios' => ['nullable', 'array'],
            'servicios.*' => ['uuid', 'exists:servicios,id'],
            'productos' => ['nullable', 'array'],
            'productos.*.producto_id' => ['required', 'uuid', 'exists:productos,id'],
            'productos.*.cantidad' => ['required', 'integer', 'min:1'],
            'observaciones' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $servicios = $this->input('servicios', []);
            $productos = $this->input('productos', []);

            if (empty($this->input('cita_id')) && empty($this->input('barbero_id'))) {
                $validator->errors()->add('barbero_id', 'Debes seleccionar un barbero o una cita.');
            }

            if (count($servicios) === 0 && count($productos) === 0) {
                $validator->errors()->add('servicios', 'Debes agregar al menos un servicio o un producto.');
            }
        });
    }
}