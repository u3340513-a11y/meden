<?php

namespace App\Repositories\Eloquent;

use App\Models\SupportTicket;
use App\Repositories\Contracts\SupportTicketRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class SupportTicketRepository extends BaseRepository implements SupportTicketRepositoryInterface
{
    public function __construct(SupportTicket $model)
    {
        parent::__construct($model);
    }

    public function getUserTickets(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function findByTicketNo(string $ticketNo)
    {
        return $this->model->where('ticket_no', $ticketNo)
            ->with(['replies.user:id,name,role', 'replies.attachments', 'attachments', 'user:id,name', 'admin:id,name'])
            ->firstOrFail();
    }

    public function getAllTickets(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with('user:id,name');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('ticket_no', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }
}
