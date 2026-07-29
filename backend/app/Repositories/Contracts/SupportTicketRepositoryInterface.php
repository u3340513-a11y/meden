<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;

interface SupportTicketRepositoryInterface extends BaseRepositoryInterface
{
    public function getUserTickets(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function findByTicketNo(string $ticketNo);

    public function getAllTickets(array $filters, int $perPage = 15): LengthAwarePaginator;
}
