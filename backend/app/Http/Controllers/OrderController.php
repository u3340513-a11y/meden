<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
    ) {}

    public function index()
    {
        $orders = $this->orderRepository->getBuyerOrders(auth()->id());
        return $this->success($orders);
    }

    public function show(int $id)
    {
        $order = Order::where('buyer_id', auth()->id())
            ->with(['items.product.coverImage', 'payment', 'refund'])
            ->findOrFail($id);

        return $this->success($order);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'address_id' => ['required', 'exists:addresses,id'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $user = auth()->user();
        $cart = $user->cart?->load('items.product');

        if (!$cart || $cart->items->isEmpty()) {
            return $this->error('Sepetiniz boş.', 400);
        }

        $address = $user->addresses()->findOrFail($request->address_id);
        $commissionRate = (float) Setting::getValue('commission_rate', 10);

        $total = $cart->totalAmount();
        $commissionAmount = round($total * $commissionRate / 100, 2);

        $order = Order::create([
            'buyer_id' => $user->id,
            'order_no' => $this->orderRepository->generateOrderNo(),
            'total' => $total,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'shipping_address' => [
                'title' => $address->title,
                'city' => $address->city->name,
                'district' => $address->district->name,
                'address_line' => $address->address_line,
                'postal_code' => $address->postal_code,
            ],
            'note' => $request->note,
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'seller_id' => $item->product->seller_id,
                'product_snapshot' => [
                    'name' => $item->product->name,
                    'price' => $item->product->currentPrice(),
                    'condition' => $item->product->condition?->label(),
                    'image' => $item->product->coverImage?->thumbnail_path,
                ],
                'quantity' => $item->quantity,
                'unit_price' => $item->product->currentPrice(),
                'total' => $item->product->currentPrice() * $item->quantity,
            ]);

            $item->product->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();

        return $this->created([
            'order_id' => $order->id,
            'order_no' => $order->order_no,
        ], 'Sipariş oluşturuldu.');
    }
}
