<?php

namespace App\Enums;

enum ProductStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Taslak',
            self::PENDING => 'Onay Bekliyor',
            self::APPROVED => 'Onaylandı',
            self::REJECTED => 'Reddedildi',
        };
    }
}
