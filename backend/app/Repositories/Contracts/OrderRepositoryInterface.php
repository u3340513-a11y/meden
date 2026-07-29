<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    public function getBuyerOrders(int $buyerId, int $perPage = 15): LengthAwarePaginator;

    public function getSellerOrders(int $sellerId, array $filters, int $perPage = 15): LengthAwarePaginator;

    public function findByOrderNo(string $orderNo);

    public function generateOrderNo(): string;
}
