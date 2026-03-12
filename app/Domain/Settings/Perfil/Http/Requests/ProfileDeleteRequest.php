<?php

namespace App\Domain\Settings\Perfil\Http\Requests;

use App\Concerns\PasswordValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class ProfileDeleteRequest extends FormRequest
{
    use PasswordValidationRules;

    public function rules(): array
    {
        return [
            'password' => $this->currentPasswordRules(),
        ];
    }
}
