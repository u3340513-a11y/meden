<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Payout;

class PayoutController extends Controller
{
    public function index()
    {
        $payouts = Payout::where('seller_id', auth()->id())
            ->latest()
            ->paginate(15);

        return $this->success($payouts);
    }
}
