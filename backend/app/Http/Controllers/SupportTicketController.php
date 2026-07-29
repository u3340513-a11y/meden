<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Models\SupportTicket;
use App\Models\SupportTicketAttachment;
use App\Repositories\Contracts\SupportTicketRepositoryInterface;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function __construct(
        private SupportTicketRepositoryInterface $ticketRepository,
    ) {}

    public function index()
    {
        return $this->success(
            $this->ticketRepository->getUserTickets(auth()->id())
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'attachments' => ['array', 'max:3'],
            'attachments.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $ticket = SupportTicket::create([
            'ticket_no' => SupportTicket::generateTicketNo(),
            'user_id' => auth()->id(),
            'subject' => $request->subject,
            'description' => $request->description,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('tickets', 'public');
                SupportTicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        return $this->created([
            'ticket_no' => $ticket->ticket_no,
        ], 'Destek talebi oluşturuldu.');
    }

    public function show(string $ticketNo)
    {
        $ticket = $this->ticketRepository->findByTicketNo($ticketNo);

        if ($ticket->user_id !== auth()->id()) {
            return $this->error('Bu talebe erişim yetkiniz yok.', 403);
        }

        return $this->success($ticket);
    }

    public function reply(Request $request, string $ticketNo)
    {
        $ticket = SupportTicket::where('ticket_no', $ticketNo)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if (!$ticket->isWritable()) {
            return $this->error('Bu talep kapatılmış, mesaj yazamazsınız.', 403);
        }

        $request->validate([
            'message' => ['required', 'string'],
        ]);

        $reply = $ticket->replies()->create([
            'user_id' => auth()->id(),
            'message' => $request->message,
            'is_admin' => false,
        ]);

        return $this->created(['reply_id' => $reply->id], 'Yanıt gönderildi.');
    }
}
