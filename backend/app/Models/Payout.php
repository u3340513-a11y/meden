<?php

namespace App\Models;

use App\Enums\PayoutStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    protected $fillable = [
        'seller_id',
        'amount',
        'commission_rate',
        'commission_amount',
        'net_amount',
        'status',
        'has_active_refund',
        'refund_warning_amount',
        'period_start',
        'period_end',
        'paid_at',
        'iban_snapshot',
        'admin_note',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'net_amount' => 'decimal:2',
            'refund_warning_amount' => 'decimal:2',
            'status' => PayoutStatus::class,
            'has_active_refund' => 'boolean',
            'period_start' => 'date',
            'period_end' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
