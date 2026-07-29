<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@medeniyetpazari.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Admin2026!'),
                'role' => UserRole::SUPER_ADMIN,
                'referral_code' => strtoupper(Str::random(8)),
                'referred_by' => null,
                'email_verified_at' => now(),
            ]
        );
    }
}
