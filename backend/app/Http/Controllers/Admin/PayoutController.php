<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PayoutStatus;
use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\Request;

class PayoutController extends Controller
{
    public function index(Request $request)
    {
        $query = Payout::with('seller:id,name,iban');
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        return $this->success($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function approve(int $id)
    {
        $payout = Payout::findOrFail($id);
        $payout->update(['status' => PayoutStatus::APPROVED]);
        return $this->success(message: 'Ödeme onaylandı.');
    }

    public function pay(int $id)
    {
        $payout = Payout::findOrFail($id);
        $payout->update([
            'status' => PayoutStatus::PAID,
            'paid_at' => now(),
        ]);
        return $this->success(message: 'Ödeme yapıldı olarak işaretlendi.');
    }

    public function reject(Request $request, int $id)
    {
        $request->validate(['admin_note' => ['required', 'string']]);
        $payout = Payout::findOrFail($id);
        $payout->update([
            'status' => PayoutStatus::REJECTED,
            'admin_note' => $request->admin_note,
        ]);
        return $this->success(message: 'Ödeme reddedildi.');
    }
}
