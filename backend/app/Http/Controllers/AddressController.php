<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        return $this->success(
            auth()->user()->addresses()->with(['city', 'district'])->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:50'],
            'city_id' => ['required', 'exists:cities,id'],
            'district_id' => ['required', 'exists:districts,id'],
            'address_line' => ['required', 'string'],
            'postal_code' => ['nullable', 'string', 'max:5'],
            'is_default' => ['boolean'],
        ]);

        if ($request->boolean('is_default')) {
            auth()->user()->addresses()->update(['is_default' => false]);
        }

        $address = auth()->user()->addresses()->create($data);
        return $this->created($address->load(['city', 'district']), 'Adres eklendi.');
    }

    public function show(int $id)
    {
        $address = auth()->user()->addresses()->with(['city', 'district'])->findOrFail($id);
        return $this->success($address);
    }

    public function update(Request $request, int $id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:50'],
            'city_id' => ['sometimes', 'exists:cities,id'],
            'district_id' => ['sometimes', 'exists:districts,id'],
            'address_line' => ['sometimes', 'string'],
            'postal_code' => ['nullable', 'string', 'max:5'],
            'is_default' => ['boolean'],
        ]);

        if ($request->boolean('is_default')) {
            auth()->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($data);
        return $this->success($address->load(['city', 'district']), 'Adres güncellendi.');
    }

    public function destroy(int $id)
    {
        auth()->user()->addresses()->findOrFail($id)->delete();
        return $this->success(message: 'Adres silindi.');
    }
}
