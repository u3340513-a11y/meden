<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Refund;
use App\Models\SupportTicket;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return $this->success([
            'users_count' => User::count(),
            'products_count' => Product::count(),
            'pending_products' => Product::pending()->count(),
            'orders_count' => Order::count(),
            'open_refunds' => Refund::whereIn('status', ['requested', 'approved'])->count(),
            'open_tickets' => SupportTicket::whereIn('status', ['open', 'in_progress'])->count(),
            'total_revenue' => Order::whereNotIn('status', ['pending', 'cancelled'])->sum('total'),
            'total_commission' => Order::whereNotIn('status', ['pending', 'cancelled'])->sum('commission_amount'),
        ]);
    }
}
