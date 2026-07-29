<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function show()
    {
        return $this->success([
            'commission_rate' => (float) Setting::getValue('commission_rate', 10),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        Setting::setValue('commission_rate', $request->commission_rate, 'payment');
        return $this->success(message: 'Komisyon oranı güncellendi.');
    }
}
