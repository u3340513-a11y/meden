<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\PasswordPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Throwable;

class ForgotPasswordController extends Controller
{
    private const REMEMBER_TOKEN_LENGTH = 60;

    /**
     * Always answers with the same message so the endpoint cannot be used to discover registered e-mails.
     * Mail transport failures are logged, never exposed.
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'max:191'],
        ]);

        try {
            $status = Password::sendResetLink($request->only('email'));

            if ($status !== Password::RESET_LINK_SENT) {
                Log::warning('Password reset link was not sent.', ['status' => $status]);
            }
        } catch (Throwable $exception) {
            Log::error('Password reset mail could not be sent.', ['error' => $exception->getMessage()]);
        }

        return $this->success(message: 'E-posta adresi kayıtlıysa şifre sıfırlama bağlantısı gönderildi.');
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email', 'max:191'],
            'password' => PasswordPolicy::rules(),
        ], PasswordPolicy::messages());

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(self::REMEMBER_TOKEN_LENGTH),
                ])->save();
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(message: 'Şifreniz başarıyla değiştirildi.');
        }

        return $this->error('Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir sıfırlama bağlantısı isteyin.', 400);
    }
}
