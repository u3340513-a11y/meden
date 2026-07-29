<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['buyer:id,name', 'items']);
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        return $this->success($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function show(int $id)
    {
        return $this->success(
            Order::with(['buyer', 'items.product', 'items.seller:id,name', 'payment', 'refund'])->findOrFail($id)
        );
    }
}
