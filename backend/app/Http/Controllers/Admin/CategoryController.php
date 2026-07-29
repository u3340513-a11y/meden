<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\CategoryVariantField;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return $this->success(
            CategoryResource::collection(
                Category::roots()->with('descendants')->orderBy('sort_order')->get()
            )
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer'],
        ]);

        $slug = Str::slug($data['name']);
        if ($data['parent_id'] ?? null) {
            $parent = Category::findOrFail($data['parent_id']);
            $slug = Str::slug($parent->name) . '-' . $slug;
        }

        $category = Category::create([...$data, 'slug' => $slug]);
        return $this->created(new CategoryResource($category), 'Kategori oluşturuldu.');
    }

    public function show(int $id)
    {
        return $this->success(
            new CategoryResource(Category::with(['children', 'variantFields'])->findOrFail($id))
        );
    }

    public function update(Request $request, int $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer'],
            'is_active' => ['boolean'],
        ]);
        $category->update($data);
        return $this->success(new CategoryResource($category), 'Kategori güncellendi.');
    }

    public function destroy(int $id)
    {
        Category::findOrFail($id)->delete();
        return $this->success(message: 'Kategori silindi.');
    }

    public function storeVariantField(Request $request, int $id)
    {
        $data = $request->validate([
            'field_name' => ['required', 'string', 'max:50'],
            'field_key' => ['required', 'string', 'max:50'],
            'is_required' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $field = CategoryVariantField::create([...$data, 'category_id' => $id]);
        return $this->created($field, 'Varyant alanı eklendi.');
    }

    public function updateVariantField(Request $request, int $id)
    {
        $field = CategoryVariantField::findOrFail($id);
        $data = $request->validate([
            'field_name' => ['sometimes', 'string', 'max:50'],
            'field_key' => ['sometimes', 'string', 'max:50'],
            'is_required' => ['boolean'],
            'sort_order' => ['integer'],
        ]);
        $field->update($data);
        return $this->success($field, 'Varyant alanı güncellendi.');
    }

    public function destroyVariantField(int $id)
    {
        CategoryVariantField::findOrFail($id)->delete();
        return $this->success(message: 'Varyant alanı silindi.');
    }
}
