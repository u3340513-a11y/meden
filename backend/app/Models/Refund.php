<?php

namespace App\Models;

use App\Enums\CargoProvider;
use App\Enums\RefundStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refund extends Model
{
    protected $fillable = [
        'order_id',
        'buyer_id',
        'seller_id',
        'reason',
        'status',
        'amount',
        'admin_note',
        'cargo_provider',
        'cargo_tracking_no',
        'refund_deadline',
        'requested_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => RefundStatus::class,
            'cargo_provider' => CargoProvider::class,
            'refund_deadline' => 'date',
            'requested_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function isExpired(): bool
    {
        return now()->greaterThan($this->refund_deadline);
    }
}
