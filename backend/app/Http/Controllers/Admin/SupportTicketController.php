<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Repositories\Contracts\SupportTicketRepositoryInterface;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function __construct(
        private SupportTicketRepositoryInterface $ticketRepository,
    ) {}

    public function index(Request $request)
    {
        return $this->success(
            $this->ticketRepository->getAllTickets(
                $request->only('status', 'search'),
                $request->integer('per_page', 15)
            )
        );
    }

    public function show(string $ticketNo)
    {
        return $this->success(
            $this->ticketRepository->findByTicketNo($ticketNo)
        );
    }

    public function reply(Request $request, string $ticketNo)
    {
        $ticket = SupportTicket::where('ticket_no', $ticketNo)->firstOrFail();
        $request->validate(['message' => ['required', 'string']]);

        $reply = $ticket->replies()->create([
            'user_id' => auth()->id(),
            'message' => $request->message,
            'is_admin' => true,
        ]);

        return $this->created(['reply_id' => $reply->id], 'Admin yanıtı gönderildi.');
    }

    public function updateStatus(Request $request, string $ticketNo)
    {
        $request->validate([
            'status' => ['required', 'in:' . implode(',', array_column(TicketStatus::cases(), 'value'))],
        ]);

        $ticket = SupportTicket::where('ticket_no', $ticketNo)->firstOrFail();
        $updateData = ['status' => $request->status];

        if ($request->status === 'closed') {
            $updateData['closed_at'] = now();
        }

        $ticket->update($updateData);
        return $this->success(message: 'Talep durumu güncellendi.');
    }

    public function assign(Request $request, string $ticketNo)
    {
        $request->validate(['admin_id' => ['nullable', 'exists:users,id']]);
        $ticket = SupportTicket::where('ticket_no', $ticketNo)->firstOrFail();
        $ticket->update(['admin_id' => $request->admin_id]);
        return $this->success(message: 'Talep atandı.');
    }
}
