<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\District;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        return $this->success(City::with('districts')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'plate_code' => ['required', 'string', 'max:2', 'unique:cities,plate_code'],
            'districts' => ['array'],
            'districts.*' => ['string', 'max:100'],
        ]);

        $city = City::create(['name' => $data['name'], 'plate_code' => $data['plate_code']]);
        foreach ($data['districts'] ?? [] as $name) {
            District::create(['city_id' => $city->id, 'name' => $name]);
        }

        return $this->created($city->load('districts'));
    }

    public function update(Request $request, int $id)
    {
        $city = City::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'plate_code' => ['sometimes', 'string', 'max:2', "unique:cities,plate_code,{$id}"],
        ]);
        $city->update($data);
        return $this->success($city, 'Şehir güncellendi.');
    }

    public function destroy(int $id)
    {
        City::findOrFail($id)->delete();
        return $this->success(message: 'Şehir silindi.');
    }
}
