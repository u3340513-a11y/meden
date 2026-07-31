<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\ImageService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function show()
    {
        return $this->success(new UserResource(auth()->user()->load('city')));
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'iban' => ['sometimes', 'nullable', 'string', 'max:34'],
            'tax_no' => ['sometimes', 'nullable', 'string', 'max:11'],
            'city_id' => ['sometimes', 'nullable', 'exists:cities,id'],
        ]);

        $user = $this->userRepository->update(
            auth()->user(),
            $request->only('name', 'phone', 'iban', 'tax_no', 'city_id')
        );

        return $this->success(new UserResource($user), 'Profil güncellendi.');
    }

    public function avatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $path = $request->file('avatar')->store('avatars', 'public');
        auth()->user()->update(['avatar' => $path]);

        return $this->success(['avatar' => "/storage/{$path}"], 'Avatar güncellendi.');
    }

    public function referral()
    {
        $user = auth()->user();

        return $this->success([
            'referral_code' => $user->referral_code,
            'referral_link' => "https://medeniyetpazari.com/kayit?ref={$user->referral_code}",
            'referral_count' => $this->userRepository->countReferrals($user->id),
        ]);
    }
}
