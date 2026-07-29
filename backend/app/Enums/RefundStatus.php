<?php

namespace App\Enums;

enum RefundStatus: string
{
    case REQUESTED = 'requested';
    case APPROVED = 'approved';
    case CARGO_SENT = 'cargo_sent';
    case CARGO_DELIVERED = 'cargo_delivered';
    case REFUNDED = 'refunded';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::REQUESTED => 'Talep Edildi',
            self::APPROVED => 'Onaylandı',
            self::CARGO_SENT => 'Kargo Gönderildi',
            self::CARGO_DELIVERED => 'Kargo Teslim Alındı',
            self::REFUNDED => 'İade Edildi',
            self::REJECTED => 'Reddedildi',
        };
    }
}
