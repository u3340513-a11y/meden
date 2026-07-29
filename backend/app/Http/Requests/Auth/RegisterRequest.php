<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:191', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'confirmed'],
            'referral_code' => ['required', 'string', 'size:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Ad soyad zorunludur.',
            'email.required' => 'E-posta adresi zorunludur.',
            'email.unique' => 'Bu e-posta adresi zaten kullanılıyor.',
            'password.min' => 'Şifre en az 8 karakter olmalıdır.',
            'password.regex' => 'Şifre en az 1 büyük harf ve 1 rakam içermelidir.',
            'password.confirmed' => 'Şifre tekrarı uyuşmuyor.',
            'referral_code.required' => 'Referans kodu zorunludur.',
            'referral_code.size' => 'Referans kodu 8 karakter olmalıdır.',
        ];
    }
}
