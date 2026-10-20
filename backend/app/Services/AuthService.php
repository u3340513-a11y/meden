<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const TOKEN_NAME = 'auth-token';

    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    /**
     * Why: membership is gated by a valid referral code only; no e-mail verification step.
     * Input: validated name, email, password, referral_code. Output: ['user' => User, 'token' => string].
     */
    public function register(array $data): array
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

        return ['user' => $user, 'token' => $this->issueToken($user)];
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['E-posta veya şifre hatalı.'],
            ]);
        }

        $user->tokens()->delete();

        return ['user' => $user, 'token' => $this->issueToken($user)];
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

    private function issueToken(User $user): string
    {
        return $user->createToken(self::TOKEN_NAME)->plainTextToken;
    }
}
