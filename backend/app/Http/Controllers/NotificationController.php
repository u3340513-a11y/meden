<?php

namespace App\Http\Controllers;

class NotificationController extends Controller
{
    public function index()
    {
        return $this->success(
            auth()->user()->notifications()->paginate(15)
        );
    }

    public function markRead(string $id)
    {
        auth()->user()->notifications()->findOrFail($id)->markAsRead();
        return $this->success(message: 'Bildirim okundu.');
    }

    public function markAllRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return $this->success(message: 'Tüm bildirimler okundu.');
    }
}
