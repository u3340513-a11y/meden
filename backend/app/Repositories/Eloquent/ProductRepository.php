<?php

namespace App\Repositories\Eloquent;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function getPublicListing(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->approved()->with(['coverImage', 'category', 'seller:id,name']);

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (!empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        $sort = $filters['sort'] ?? 'newest';
        $query = match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'popular' => $query->orderByDesc('view_count'),
            default => $query->latest(),
        };

        return $query->paginate($perPage);
    }

    public function getBySlug(string $slug)
    {
        return $this->model->approved()
            ->with(['images', 'category.variantFields', 'seller:id,name,city_id'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function getSellerProducts(int $sellerId, array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->where('seller_id', $sellerId)->with(['coverImage', 'images', 'category']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function getPendingProducts(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->pending()
            ->with(['coverImage', 'seller:id,name'])
            ->latest()
            ->paginate($perPage);
    }
}
