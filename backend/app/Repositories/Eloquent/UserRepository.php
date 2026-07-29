<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function findByReferralCode(string $code): ?User
    {
        return $this->model->where('referral_code', $code)->first();
    }

    public function getReferralTree(int $userId): Collection
    {
        return $this->model->where('referred_by', $userId)
            ->with('referrals')
            ->orderBy('created_at')
            ->get();
    }

    public function countReferrals(int $userId): int
    {
        return $this->model->where('referred_by', $userId)->count();
    }

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        return $query->latest()->paginate($perPage);
    }
}
