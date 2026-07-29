<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function index(Request $request)
    {
        $users = User::with('referrer:id,name,email')
            ->whereNotNull('referred_by')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return $this->success($users->through(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'referral_code' => $u->referral_code,
            'referred_by_name' => $u->referrer?->name,
            'referred_by_email' => $u->referrer?->email,
            'referral_count' => $u->referrals()->count(),
            'created_at' => $u->created_at->toISOString(),
        ]));
    }

    public function show(int $userId)
    {
        $user = $this->userRepository->findOrFail($userId);
        $tree = $this->userRepository->getReferralTree($userId);

        return $this->success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'referral_code' => $user->referral_code,
            ],
            'referrals' => $tree,
        ]);
    }
}
