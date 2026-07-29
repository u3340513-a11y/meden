<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case PREPARING = 'preparing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Beklemede',
            self::CONFIRMED => 'Onaylandı',
            self::PREPARING => 'Hazırlanıyor',
            self::SHIPPED => 'Kargoya Verildi',
            self::DELIVERED => 'Teslim Edildi',
            self::CANCELLED => 'İptal Edildi',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'warning',
            self::CONFIRMED => 'primary',
            self::PREPARING => 'primary',
            self::SHIPPED => 'accent',
            self::DELIVERED => 'success',
            self::CANCELLED => 'destructive',
        };
    }
}
