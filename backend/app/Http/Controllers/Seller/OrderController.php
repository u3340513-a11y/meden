<?php

namespace App\Http\Controllers\Seller;

use App\Enums\CargoProvider;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
    ) {}

    public function index(Request $request)
    {
        $orders = $this->orderRepository->getSellerOrders(
            auth()->id(),
            $request->only('status'),
        );

        return $this->success($orders);
    }

    public function show(int $id)
    {
        $order = Order::whereHas('items', fn ($q) => $q->where('seller_id', auth()->id()))
            ->with(['buyer:id,name', 'items' => fn ($q) => $q->where('seller_id', auth()->id()), 'refund'])
            ->findOrFail($id);

        return $this->success($order);
    }

    public function confirm(int $id)
    {
        $order = $this->getSellerOrder($id, OrderStatus::PENDING);
        $order->update(['status' => OrderStatus::CONFIRMED]);
        return $this->success(message: 'Sipariş onaylandı.');
    }

    public function ship(Request $request, int $id)
    {
        $request->validate([
            'cargo_provider' => ['required', 'in:' . implode(',', array_column(CargoProvider::cases(), 'value'))],
            'cargo_tracking_no' => ['required', 'string', 'max:50'],
        ]);

        $order = $this->getSellerOrder($id, OrderStatus::CONFIRMED);
        $order->update([
            'status' => OrderStatus::SHIPPED,
            'cargo_provider' => $request->cargo_provider,
            'cargo_tracking_no' => $request->cargo_tracking_no,
        ]);

        return $this->success(message: 'Kargo bilgisi güncellendi.');
    }

    public function deliver(int $id)
    {
        $order = $this->getSellerOrder($id, OrderStatus::SHIPPED);
        $order->update([
            'status' => OrderStatus::DELIVERED,
            'delivered_at' => now(),
        ]);

        return $this->success(message: 'Sipariş teslim edildi olarak işaretlendi.');
    }

    private function getSellerOrder(int $id, OrderStatus $expectedStatus): Order
    {
        return Order::whereHas('items', fn ($q) => $q->where('seller_id', auth()->id()))
            ->where('status', $expectedStatus)
            ->findOrFail($id);
    }
}
