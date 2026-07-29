<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;

class LoginController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function __invoke(LoginRequest $request)
    {
        $user = $this->authService->login($request->validated());

        return $this->success(
            ['user' => new UserResource($user)],
            'Giriş başarılı.'
        );
    }
}
