<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    public function getPublicListing(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function getBySlug(string $slug);

    public function getSellerProducts(int $sellerId, array $filters, int $perPage = 15): LengthAwarePaginator;

    public function getPendingProducts(int $perPage = 15): LengthAwarePaginator;
}
