<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return $this->success(message: 'E-posta adresi doğrulandı.');
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->success(message: 'E-posta zaten doğrulanmış.');
        }

        $request->user()->sendEmailVerificationNotification();
        return $this->success(message: 'Doğrulama e-postası tekrar gönderildi.');
    }
}
