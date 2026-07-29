<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'variant_fields' => $this->whenLoaded('variantFields', fn () =>
                $this->variantFields->map(fn ($f) => [
                    'id' => $f->id,
                    'field_name' => $f->field_name,
                    'field_key' => $f->field_key,
                    'is_required' => $f->is_required,
                ])
            ),
        ];
    }
}
