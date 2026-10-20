<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    private const FRONTEND_RESET_PASSWORD_PATH = '/sifre-sifirla';

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(
            fn (object $user, string $token): string => $this->frontendResetPasswordUrl($user->getEmailForPasswordReset(), $token)
        );
    }

    /**
     * Why: the API has no named "password.reset" route, so Laravel's default link generation threw
     *      RouteNotFoundException and no reset mail was ever built; the mail must open the SPA page instead.
     * Input: user's e-mail and the plain reset token. Output: absolute SPA URL carrying token and email.
     */
    private function frontendResetPasswordUrl(string $email, string $token): string
    {
        return rtrim((string) config('app.url'), '/')
            . self::FRONTEND_RESET_PASSWORD_PATH . '/' . $token
            . '?' . http_build_query(['email' => $email]);
    }
}
