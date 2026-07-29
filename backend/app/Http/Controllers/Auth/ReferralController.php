<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;

class ReferralController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function validate(string $code)
    {
        $referrer = $this->authService->validateReferralCode($code);

        if (!$referrer) {
            return $this->error('Geçersiz referans kodu.', 404);
        }

        return $this->success([
            'valid' => true,
            'referrer_name' => $referrer->name,
        ]);
    }
}
