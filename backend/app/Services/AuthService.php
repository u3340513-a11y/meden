<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
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

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !\Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['E-posta veya şifre hatalı.'],
            ]);
        }

        if (!$user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Lütfen önce e-posta adresinizi doğrulayın.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Why: unverified users cannot log in, so verification must work without a session.
     * Input: user id and sha1(email) hash from the signed link. Output: true when verified.
     */
    public function verifyEmail(int $userId, string $hash): bool
    {
        $user = $this->userRepository->find($userId);

        if (!$user || !hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return false;
        }

        if (!$user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return true;
    }

    /**
     * Resends the verification mail. Silent for unknown/verified emails to avoid user enumeration.
     */
    public function resendVerification(string $email): void
    {
        $user = $this->userRepository->findByEmail($email);

        if ($user && !$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }
    }

    public function logout(): void
    {
        $user = Auth::user();
        if ($user) {
            $user->currentAccessToken()->delete();
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
