<?php

namespace App\Http\Controllers;

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
        $products = $this->productRepository->getPublicListing(
            $request->only('category', 'condition', 'search', 'min_price', 'max_price', 'sort'),
            $request->integer('per_page', 15)
        );

        return $this->success(ProductResource::collection($products)->response()->getData(true));
    }

    public function show(string $slug)
    {
        $product = $this->productRepository->getBySlug($slug);
        $product->increment('view_count');

        return $this->success(new ProductResource($product));
    }
}
