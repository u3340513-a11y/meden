<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
    ) {}

    public function index(Request $request)
    {
        $products = $this->productRepository->getSellerProducts(
            auth()->id(),
            $request->only('status'),
            $request->integer('per_page', 15)
        );

        return $this->success(ProductResource::collection($products)->response()->getData(true));
    }

    public function show($id)
    {
        $product = \App\Models\Product::with(['images', 'coverImage', 'category'])
            ->where('seller_id', auth()->id())
            ->findOrFail($id);

        return $this->success((new ProductResource($product))->toArray(request()));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:1'],
            'discounted_price' => ['nullable', 'numeric', 'lt:price'],
            'stock' => ['required', 'integer', 'min:1'],
            'condition' => ['required', 'in:used,lightly_used,new'],
            'variant_data' => ['nullable', 'array'],
            'images' => ['required', 'array', 'min:1', 'max:10'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $product = auth()->user()->products()->create([
            ...$data,
            'slug' => Str::slug($data['name']) . '-' . Str::random(6),
            'status' => 'pending',
        ]);

        foreach ($request->file('images') as $i => $file) {
            $path = $file->store("products/{$product->id}", 'public');
            $product->images()->create([
                'path' => $path,
                'thumbnail_path' => $path,
                'sort_order' => $i,
                'is_cover' => $i === 0,
            ]);
        }

        return $this->created(
            new ProductResource($product->load('images')),
            'Ürün oluşturuldu. Onay bekliyor.'
        );
    }

    public function update(Request $request, int $id)
    {
        $product = auth()->user()->products()->findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:200'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'numeric', 'min:1'],
            'discounted_price' => ['nullable', 'numeric'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'condition' => ['sometimes', 'in:used,lightly_used,new'],
            'variant_data' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $product->update($data);
        return $this->success(new ProductResource($product), 'Ürün güncellendi.');
    }

    public function destroy(int $id)
    {
        auth()->user()->products()->findOrFail($id)->delete();
        return $this->success(message: 'Ürün silindi.');
    }
}
