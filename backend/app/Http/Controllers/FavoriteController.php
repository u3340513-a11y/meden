<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Favorite::where('user_id', auth()->id())
            ->with('product.coverImage')
            ->latest()
            ->paginate(15);

        return $this->success($favorites);
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => ['required', 'exists:products,id']]);

        Favorite::firstOrCreate([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return $this->created(message: 'Favorilere eklendi.');
    }

    public function destroy(int $productId)
    {
        Favorite::where('user_id', auth()->id())
            ->where('product_id', $productId)
            ->delete();

        return $this->success(message: 'Favorilerden çıkarıldı.');
    }
}
