<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function getBuyerOrders(int $buyerId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('buyer_id', $buyerId)
            ->with('items.product.coverImage')
            ->latest()
            ->paginate($perPage);
    }

    public function getSellerOrders(int $sellerId, array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->whereHas('items', fn ($q) => $q->where('seller_id', $sellerId))
            ->with([
                'buyer:id,name,email,phone',
                'items' => fn ($q) => $q->where('seller_id', $sellerId)->with('product:id,name,price,discounted_price'),
            ]);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function findByOrderNo(string $orderNo)
    {
        return $this->model->where('order_no', $orderNo)
            ->with(['items.product', 'buyer', 'payment', 'refund'])
            ->firstOrFail();
    }

    public function generateOrderNo(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -4));
        return "MP-{$date}-{$random}";
    }
}
