<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';
    case SUCCESS = 'success';
    case FAILED = 'failed';
    case REFUNDED = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Beklemede',
            self::SUCCESS => 'Başarılı',
            self::FAILED => 'Başarısız',
            self::REFUNDED => 'İade Edildi',
        };
    }
}
