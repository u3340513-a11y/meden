<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->roots()
            ->with('descendants')
            ->orderBy('sort_order')
            ->get();

        return $this->success(CategoryResource::collection($categories));
    }

    public function variantFields(int $id)
    {
        $category = Category::findOrFail($id);
        $fields = $category->variantFields()->orderBy('sort_order')->get();

        return $this->success($fields->map(fn ($f) => [
            'id' => $f->id,
            'field_name' => $f->field_name,
            'field_key' => $f->field_key,
            'is_required' => $f->is_required,
        ]));
    }
}
