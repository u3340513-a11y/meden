<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role->value,
            'role_label' => $this->role->label(),
            'city' => $this->whenLoaded('city', fn () => [
                'id' => $this->city->id,
                'name' => $this->city->name,
            ]),
            'avatar' => $this->avatar
                ? (str_starts_with($this->avatar, 'http://') || str_starts_with($this->avatar, 'https://')
                    ? $this->avatar
                    : "/storage/{$this->avatar}")
                : null,
            'referral_code' => $this->referral_code,
            'email_verified' => $this->hasVerifiedEmail(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
