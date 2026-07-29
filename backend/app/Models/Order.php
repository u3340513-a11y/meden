<?php

namespace App\Models;

use App\Enums\CargoProvider;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'buyer_id',
        'order_no',
        'status',
        'total',
        'commission_rate',
        'commission_amount',
        'shipping_address',
        'cargo_provider',
        'cargo_tracking_no',
        'delivered_at',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'shipping_address' => 'array',
            'status' => OrderStatus::class,
            'cargo_provider' => CargoProvider::class,
            'delivered_at' => 'datetime',
        ];
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function refund(): HasOne
    {
        return $this->hasOne(Refund::class);
    }

    public function sellerAmount(): float
    {
        return $this->total - $this->commission_amount;
    }
}
