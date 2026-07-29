<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function register(array $data): User
    {
        $referrer = $this->userRepository->findByReferralCode($data['referral_code']);

        if (!$referrer) {
            throw ValidationException::withMessages([
                'referral_code' => ['Geçersiz referans kodu.'],
            ]);
        }

        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'referral_code' => $this->generateUniqueReferralCode(),
            'referred_by' => $referrer->id,
        ]);

        event(new Registered($user));

        return $user;
    }

    public function login(array $credentials): User
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['E-posta veya şifre hatalı.'],
            ]);
        }

        $user = Auth::user();

        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['Lütfen önce e-posta adresinizi doğrulayın.'],
            ]);
        }

        return $user;
    }

    public function logout(): void
    {
        Auth::guard('web')->logout();
        try {
            request()->session()->invalidate();
            request()->session()->regenerateToken();
        } catch (\Exception) {
        }
    }

    public function validateReferralCode(string $code): ?User
    {
        return $this->userRepository->findByReferralCode($code);
    }

    public function generateUniqueReferralCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while ($this->userRepository->findByReferralCode($code));

        return $code;
    }
}
