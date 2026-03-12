<?php

namespace App\Domain\Settings\Perfil\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Fortify\Features;
use Laravel\Fortify\InteractsWithTwoFactorState;

class TwoFactorAuthenticationRequest extends FormRequest
{
    use InteractsWithTwoFactorState;

    public function authorize(): bool
    {
        return Features::enabled(Features::twoFactorAuthentication());
    }

    public function rules(): array
    {
        return [];
    }
}
