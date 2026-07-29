<?php

namespace App\Enums;

enum ProductCondition: string
{
    case USED = 'used';
    case LIGHTLY_USED = 'lightly_used';
    case NEW = 'new';

    public function label(): string
    {
        return match ($this) {
            self::USED => 'İkinci El',
            self::LIGHTLY_USED => 'Az Kullanılmış',
            self::NEW => 'Sıfır',
        };
    }
}
