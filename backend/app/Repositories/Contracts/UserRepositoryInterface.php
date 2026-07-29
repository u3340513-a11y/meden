<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function findByReferralCode(string $code): ?User;

    public function getReferralTree(int $userId): Collection;

    public function countReferrals(int $userId): int;
}
