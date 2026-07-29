<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return $this->success(Setting::all()->groupBy('group'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['required'],
            'settings.*.group' => ['string'],
        ]);

        foreach ($request->settings as $setting) {
            Setting::setValue(
                $setting['key'],
                $setting['value'],
                $setting['group'] ?? 'general'
            );
        }

        return $this->success(message: 'Ayarlar güncellendi.');
    }
}
