<?php

namespace App\Enums;

enum TicketStatus: string
{
    case OPEN = 'open';
    case IN_PROGRESS = 'in_progress';
    case UNDER_REVIEW = 'under_review';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'Açık',
            self::IN_PROGRESS => 'İşlemde',
            self::UNDER_REVIEW => 'İnceleniyor',
            self::RESOLVED => 'Çözümlendi',
            self::CLOSED => 'Kapatıldı',
        };
    }

    public function isWritable(): bool
    {
        return $this !== self::CLOSED;
    }
}
