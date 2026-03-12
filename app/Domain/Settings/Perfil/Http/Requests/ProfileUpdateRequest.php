<?php

namespace App\Domain\Settings\Perfil\Http\Requests;

use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    public function rules(): array
    {
        return $this->profileRules($this->user()->id);
    }
}
