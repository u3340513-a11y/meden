<?php

namespace App\Models;

use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discounted_price',
        'stock',
        'variant_data',
        'condition',
        'status',
        'rejection_reason',
        'is_active',
    ];

    protected $appends = ['current_price'];

    protected function currentPrice(): Attribute
    {
        return Attribute::get(fn () => $this->discounted_price ?? $this->price);
    }

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discounted_price' => 'decimal:2',
            'variant_data' => 'array',
            'condition' => ProductCondition::class,
            'status' => ProductStatus::class,
            'is_active' => 'boolean',
        ];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function coverImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_cover', true);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', ProductStatus::APPROVED)->where('is_active', true);
    }

    public function scopePending($query)
    {
        return $query->where('status', ProductStatus::PENDING);
    }
}
