<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;

class LogoutController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function __invoke()
    {
        $this->authService->logout();
        return $this->success(message: 'Çıkış yapıldı.');
    }
}
