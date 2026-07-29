<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
        $cart->load('items.product.coverImage');

        return $this->success([
            'items' => $cart->items->map(fn (CartItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'product_slug' => $item->product->slug,
                'price' => $item->product->current_price,
                'quantity' => $item->quantity,
                'cover_image' => $item->product->coverImage
                    ? asset("storage/{$item->product->coverImage->thumbnail_path}")
                    : null,
                'stock' => $item->product->stock,
            ]),
            'total' => $cart->totalAmount(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['integer', 'min:1'],
        ]);

        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);

        $item = CartItem::updateOrCreate(
            ['cart_id' => $cart->id, 'product_id' => $request->product_id],
            ['quantity' => $request->integer('quantity', 1)]
        );

        return $this->created(['item_id' => $item->id], 'Ürün sepete eklendi.');
    }

    public function update(Request $request, int $id)
    {
        $request->validate(['quantity' => ['required', 'integer', 'min:1']]);

        $item = CartItem::whereHas('cart', fn ($q) => $q->where('user_id', auth()->id()))
            ->findOrFail($id);
        $item->update(['quantity' => $request->quantity]);

        return $this->success(message: 'Miktar güncellendi.');
    }

    public function destroy(int $id)
    {
        CartItem::whereHas('cart', fn ($q) => $q->where('user_id', auth()->id()))
            ->findOrFail($id)
            ->delete();

        return $this->success(message: 'Ürün sepetten çıkarıldı.');
    }

    public function clear()
    {
        $cart = Cart::where('user_id', auth()->id())->first();
        $cart?->items()->delete();

        return $this->success(message: 'Sepet temizlendi.');
    }
}
