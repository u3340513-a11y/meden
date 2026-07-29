<?php

namespace App\Enums;

enum CargoProvider: string
{
    case YURTICI = 'yurtici';
    case ARAS = 'aras';
    case MNG = 'mng';
    case PTT = 'ptt';
    case SURAT = 'surat';
    case UPS = 'ups';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::YURTICI => 'Yurtiçi Kargo',
            self::ARAS => 'Aras Kargo',
            self::MNG => 'MNG Kargo',
            self::PTT => 'PTT Kargo',
            self::SURAT => 'Sürat Kargo',
            self::UPS => 'UPS',
            self::OTHER => 'Diğer',
        };
    }
}
