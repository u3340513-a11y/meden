<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\RefundStatus;
use App\Models\Order;
use App\Models\Refund;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    public function store(Request $request, int $orderId)
    {
        $order = Order::where('buyer_id', auth()->id())
            ->where('status', OrderStatus::DELIVERED)
            ->findOrFail($orderId);

        if ($order->refund) {
            return $this->error('Bu sipariş için zaten iade talebi var.', 400);
        }

        $deadline = $order->delivered_at->addDays(14);
        if (now()->greaterThan($deadline)) {
            return $this->error('İade süresi dolmuş (14 gün).', 400);
        }

        $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $sellerId = $order->items->first()->seller_id;

        $refund = Refund::create([
            'order_id' => $order->id,
            'buyer_id' => auth()->id(),
            'seller_id' => $sellerId,
            'reason' => $request->reason,
            'amount' => $order->total,
            'refund_deadline' => $deadline,
            'requested_at' => now(),
        ]);

        return $this->created([
            'refund_id' => $refund->id,
        ], 'İade talebi oluşturuldu.');
    }
}
