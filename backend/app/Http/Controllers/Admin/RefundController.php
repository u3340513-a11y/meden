<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RefundStatus;
use App\Http\Controllers\Controller;
use App\Models\Refund;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    public function index(Request $request)
    {
        $query = Refund::with(['buyer:id,name', 'seller:id,name', 'order:id,order_no']);
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        return $this->success($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function approve(Request $request, int $id)
    {
        $refund = Refund::findOrFail($id);
        $refund->update([
            'status' => RefundStatus::APPROVED,
            'admin_note' => $request->admin_note,
        ]);
        return $this->success(message: 'İade talebi onaylandı.');
    }

    public function reject(Request $request, int $id)
    {
        $request->validate(['admin_note' => ['required', 'string']]);
        $refund = Refund::findOrFail($id);
        $refund->update([
            'status' => RefundStatus::REJECTED,
            'admin_note' => $request->admin_note,
            'resolved_at' => now(),
        ]);
        return $this->success(message: 'İade talebi reddedildi.');
    }

    public function complete(int $id)
    {
        $refund = Refund::findOrFail($id);
        $refund->update([
            'status' => RefundStatus::REFUNDED,
            'resolved_at' => now(),
        ]);
        return $this->success(message: 'İade tamamlandı.');
    }
}
