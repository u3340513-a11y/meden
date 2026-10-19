<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    private const DEFAULT_VERIFICATION_EXPIRE_MINUTES = 60;
    private const FRONTEND_VERIFICATION_PATH = '/e-posta-dogrula';

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
        VerifyEmail::createUrlUsing(fn (MustVerifyEmail $user): string => $this->frontendVerificationUrl($user));
    }

    /**
     * Why: the mail must open the SPA page (not raw API JSON); the page then calls the signed API route.
     * Input: user to verify. Output: SPA URL carrying id, hash, expires and signature.
     */
    private function frontendVerificationUrl(MustVerifyEmail $user): string
    {
        $expiresAt = Carbon::now()->addMinutes(
            (int) config('auth.verification.expire', self::DEFAULT_VERIFICATION_EXPIRE_MINUTES)
        );
        $id = $user->getKey();
        $hash = sha1($user->getEmailForVerification());

        $signedUrl = URL::temporarySignedRoute('verification.verify', $expiresAt, ['id' => $id, 'hash' => $hash]);
        parse_str((string) parse_url($signedUrl, PHP_URL_QUERY), $query);

        return rtrim((string) config('app.url'), '/')
            . self::FRONTEND_VERIFICATION_PATH . "/{$id}/{$hash}?"
            . http_build_query(['expires' => $query['expires'], 'signature' => $query['signature']]);
    }
}
