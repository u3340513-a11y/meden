<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function index(Request $request)
    {
        return $this->success(
            $this->userRepository->paginate(
                $request->integer('per_page', 15),
                $request->only('search', 'role')
            )
        );
    }

    public function show(int $id)
    {
        $user = $this->userRepository->findOrFail($id);
        $user->load(['city', 'referrer:id,name,email']);
        return $this->success(new UserResource($user));
    }

    public function update(Request $request, int $id)
    {
        $user = $this->userRepository->findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);
        $this->userRepository->update($user, $data);
        return $this->success(message: 'Kullanıcı güncellendi.');
    }

    public function updateRole(Request $request, int $id)
    {
        $user = $this->userRepository->findOrFail($id);
        $request->validate([
            'role' => ['required', 'in:' . implode(',', array_column(UserRole::cases(), 'value'))],
        ]);
        $user->update(['role' => $request->role]);
        return $this->success(message: 'Kullanıcı rolü güncellendi.');
    }

    public function destroy(int $id)
    {
        $user = $this->userRepository->findOrFail($id);
        if ($user->isSuperAdmin()) {
            return $this->error('Süper admin silinemez.', 403);
        }
        $user->delete();
        return $this->success(message: 'Kullanıcı silindi.');
    }
}
