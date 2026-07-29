<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function index(Request $request)
    {
        $products = $this->productRepository->paginate(
            $request->integer('per_page', 15),
            $request->only('status', 'search')
        );

        return $this->success(ProductResource::collection($products)->response()->getData(true));
    }

    public function approve(int $id)
    {
        $product = $this->productRepository->findOrFail($id);
        $product->update([
            'status' => ProductStatus::APPROVED,
            'rejection_reason' => null,
        ]);
        return $this->success(message: 'Ürün onaylandı.');
    }

    public function reject(Request $request, int $id)
    {
        $request->validate(['reason' => ['required', 'string', 'max:500']]);
        $product = $this->productRepository->findOrFail($id);
        $product->update([
            'status' => ProductStatus::REJECTED,
            'rejection_reason' => $request->reason,
        ]);
        return $this->success(message: 'Ürün reddedildi.');
    }
}
