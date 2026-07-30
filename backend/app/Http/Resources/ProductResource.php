<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->when(
                !preg_match('#/products$#', $request->path()),
                fn () => $this->description
            ),
            'price' => $this->price,
            'discounted_price' => $this->discounted_price,
            'current_price' => $this->current_price,
            'stock' => $this->stock,
            'condition' => $this->condition?->value,
            'condition_label' => $this->condition?->label(),
            'variant_data' => $this->variant_data,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'view_count' => $this->view_count,
            'cover_image' => $this->whenLoaded('coverImage', fn () =>
                $this->coverImage ? self::resolveImageUrl($this->coverImage->thumbnail_path) : null
            ),
            'images' => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => self::resolveImageUrl($img->path),
                    'thumbnail' => self::resolveImageUrl($img->thumbnail_path),
                    'is_cover' => $img->is_cover,
                ])
            ),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'seller' => $this->whenLoaded('seller', fn () => [
                'id' => $this->seller->id,
                'name' => $this->seller->name,
            ]),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    private static function resolveImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return url("/storage/{$path}");
    }
}
