<?php

namespace App\Domain\Settings\Perfil\Http\Requests;

use App\Concerns\PasswordValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class PasswordUpdateRequest extends FormRequest
{
    use PasswordValidationRules;

    public function rules(): array
    {
        return [
            'current_password' => $this->currentPasswordRules(),
            'password'         => $this->passwordRules(),
        ];
    }
}
