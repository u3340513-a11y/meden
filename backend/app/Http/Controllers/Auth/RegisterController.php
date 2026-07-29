<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;

class RegisterController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function __invoke(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());

        return $this->created(
            ['user' => $user->only('id', 'name', 'email')],
            'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.'
        );
    }
}
