<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;

class RegisterController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function __invoke(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return $this->created(
            ['user' => new UserResource($result['user']), 'token' => $result['token']],
            'Kayıt başarılı.'
        );
    }
}
