<?php

namespace App\Enums;

enum PayoutStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case HAS_REFUND = 'has_refund';
    case PAID = 'paid';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Beklemede',
            self::APPROVED => 'Onaylandı',
            self::HAS_REFUND => 'İade Var',
            self::PAID => 'Ödendi',
            self::REJECTED => 'Reddedildi',
        };
    }

    public function hasWarning(): bool
    {
        return $this === self::HAS_REFUND;
    }
}
