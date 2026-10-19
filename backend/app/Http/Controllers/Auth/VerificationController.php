<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function verify(int $id, string $hash)
    {
        if (!$this->authService->verifyEmail($id, $hash)) {
            return $this->error('Geçersiz doğrulama bağlantısı.', 403);
        }

        return $this->success(message: 'E-posta adresi doğrulandı.');
    }

    public function resend(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:191'],
        ]);

        $this->authService->resendVerification($validated['email']);

        return $this->success(message: 'Hesap doğrulanmamışsa doğrulama e-postası gönderildi.');
    }
}
