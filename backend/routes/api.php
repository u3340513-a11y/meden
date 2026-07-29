<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\ReferralController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Seller;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('referral/{code}/validate', [ReferralController::class, 'validate']);
        Route::post('register', RegisterController::class)->middleware('throttle:3,1');
        Route::post('login', LoginController::class)->middleware('throttle:5,1');
        Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->middleware('throttle:2,1');
        Route::post('reset-password', [ForgotPasswordController::class, 'reset']);
        Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
            ->middleware(['auth:sanctum', 'signed'])->name('verification.verify');
        Route::post('email/resend', [VerificationController::class, 'resend'])
            ->middleware(['auth:sanctum', 'throttle:6,1']);
        Route::post('logout', LogoutController::class)->middleware('auth:sanctum');
    });

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{id}/variant-fields', [CategoryController::class, 'variantFields']);
    Route::get('cities', fn () => \App\Models\City::with('districts')->get());

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{slug}', [ProductController::class, 'show']);

    Route::middleware(['auth:sanctum', 'verified'])->group(function () {

        Route::get('user', fn () => new \App\Http\Resources\UserResource(auth()->user()));

        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::post('profile/avatar', [ProfileController::class, 'avatar']);
        Route::get('profile/referral', [ProfileController::class, 'referral']);

        Route::get('cart', [CartController::class, 'index']);
        Route::post('cart/items', [CartController::class, 'store']);
        Route::patch('cart/items/{id}', [CartController::class, 'update']);
        Route::delete('cart/items/{id}', [CartController::class, 'destroy']);
        Route::delete('cart', [CartController::class, 'clear']);

        Route::post('checkout', [OrderController::class, 'checkout']);
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{id}', [OrderController::class, 'show']);
        Route::post('orders/{id}/refund', [RefundController::class, 'store']);

        Route::get('favorites', [FavoriteController::class, 'index']);
        Route::post('favorites', [FavoriteController::class, 'store']);
        Route::delete('favorites/{productId}', [FavoriteController::class, 'destroy']);

        Route::apiResource('addresses', AddressController::class);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);

        Route::get('support/tickets', [SupportTicketController::class, 'index']);
        Route::post('support/tickets', [SupportTicketController::class, 'store']);
        Route::get('support/tickets/{ticketNo}', [SupportTicketController::class, 'show']);
        Route::post('support/tickets/{ticketNo}/reply', [SupportTicketController::class, 'reply']);

        Route::prefix('seller')->group(function () {
            Route::get('dashboard', [Seller\DashboardController::class, 'index']);
            Route::get('products', [Seller\ProductController::class, 'index']);
            Route::post('products', [Seller\ProductController::class, 'store']);
            Route::put('products/{id}', [Seller\ProductController::class, 'update']);
            Route::delete('products/{id}', [Seller\ProductController::class, 'destroy']);
            Route::get('orders', [Seller\OrderController::class, 'index']);
            Route::get('orders/{id}', [Seller\OrderController::class, 'show']);
            Route::patch('orders/{id}/confirm', [Seller\OrderController::class, 'confirm']);
            Route::patch('orders/{id}/ship', [Seller\OrderController::class, 'ship']);
            Route::patch('orders/{id}/deliver', [Seller\OrderController::class, 'deliver']);
            Route::get('payouts', [Seller\PayoutController::class, 'index']);
        });

        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::get('dashboard', [Admin\DashboardController::class, 'index']);
            Route::get('users', [Admin\UserController::class, 'index']);
            Route::get('users/{id}', [Admin\UserController::class, 'show']);
            Route::patch('users/{id}', [Admin\UserController::class, 'update']);
            Route::patch('users/{id}/role', [Admin\UserController::class, 'updateRole'])->middleware('super_admin');
            Route::delete('users/{id}', [Admin\UserController::class, 'destroy']);
            Route::get('products', [Admin\ProductController::class, 'index']);
            Route::patch('products/{id}/approve', [Admin\ProductController::class, 'approve']);
            Route::patch('products/{id}/reject', [Admin\ProductController::class, 'reject']);
            Route::get('orders', [Admin\OrderController::class, 'index']);
            Route::get('orders/{id}', [Admin\OrderController::class, 'show']);
            Route::get('refunds', [Admin\RefundController::class, 'index']);
            Route::patch('refunds/{id}/approve', [Admin\RefundController::class, 'approve']);
            Route::patch('refunds/{id}/reject', [Admin\RefundController::class, 'reject']);
            Route::patch('refunds/{id}/complete', [Admin\RefundController::class, 'complete']);
            Route::apiResource('categories', Admin\CategoryController::class);
            Route::post('categories/{id}/variant-fields', [Admin\CategoryController::class, 'storeVariantField']);
            Route::put('variant-fields/{id}', [Admin\CategoryController::class, 'updateVariantField']);
            Route::delete('variant-fields/{id}', [Admin\CategoryController::class, 'destroyVariantField']);
            Route::get('cities', [Admin\CityController::class, 'index']);
            Route::post('cities', [Admin\CityController::class, 'store']);
            Route::put('cities/{id}', [Admin\CityController::class, 'update']);
            Route::delete('cities/{id}', [Admin\CityController::class, 'destroy']);
            Route::get('commission', [Admin\CommissionController::class, 'show']);
            Route::put('commission', [Admin\CommissionController::class, 'update']);
            Route::get('payouts', [Admin\PayoutController::class, 'index']);
            Route::patch('payouts/{id}/approve', [Admin\PayoutController::class, 'approve']);
            Route::patch('payouts/{id}/pay', [Admin\PayoutController::class, 'pay']);
            Route::patch('payouts/{id}/reject', [Admin\PayoutController::class, 'reject']);
            Route::get('settings', [Admin\SettingController::class, 'index']);
            Route::put('settings', [Admin\SettingController::class, 'update']);
            Route::get('referrals', [Admin\ReferralController::class, 'index'])->middleware('super_admin');
            Route::get('referrals/{userId}', [Admin\ReferralController::class, 'show'])->middleware('super_admin');
            Route::get('support/tickets', [Admin\SupportTicketController::class, 'index']);
            Route::get('support/tickets/{ticketNo}', [Admin\SupportTicketController::class, 'show']);
            Route::post('support/tickets/{ticketNo}/reply', [Admin\SupportTicketController::class, 'reply']);
            Route::patch('support/tickets/{ticketNo}/status', [Admin\SupportTicketController::class, 'updateStatus']);
            Route::patch('support/tickets/{ticketNo}/assign', [Admin\SupportTicketController::class, 'assign']);
        });
    });

});
