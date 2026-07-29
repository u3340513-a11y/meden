<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Product;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return $this->success([
            'total_products' => Product::where('seller_id', $userId)->count(),
            'active_products' => Product::where('seller_id', $userId)->approved()->count(),
            'pending_products' => Product::where('seller_id', $userId)->pending()->count(),
            'total_orders' => Order::whereHas('items', fn ($q) => $q->where('seller_id', $userId))->count(),
            'total_revenue' => Payout::where('seller_id', $userId)->where('status', 'paid')->sum('net_amount'),
            'pending_payouts' => Payout::where('seller_id', $userId)->where('status', 'pending')->sum('net_amount'),
        ]);
    }
}
