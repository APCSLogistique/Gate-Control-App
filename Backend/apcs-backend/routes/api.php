<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\TimeslotController;
use App\Http\Controllers\GateController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\InternalToolsController;


use Illuminate\Http\Request;

Route::post('/register', [UserController::class, 'Register']);
Route::post('/login', [UserController::class, 'login']);
// User API Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'getProfile']);
        Route::get('/bookings', [UserController::class, 'getUserBookings']);
    });
});

// Booking API Routes
Route::middleware('auth:sanctum')->prefix('booking')->group(function () {
    Route::get('/{id}', [BookingController::class, 'getBookingById']); // Admin only
    Route::get('/{date}/{hour}', [BookingController::class, 'getBookingsByDateAndHour']); // Carrier only
    Route::post('/', [BookingController::class, 'createBooking']); // Carrier only
    Route::put('/{id}/status', [BookingController::class, 'updateBookingStatus']); // Carrier only
    Route::put('/{id}/reschedule', [BookingController::class, 'rescheduleBooking']); // Carrier only
    Route::delete('/{id}', [BookingController::class, 'deleteBooking']); // Carrier only
});

// Timeslot API Routes
Route::prefix('timeslot')->group(function () {
    Route::get('/{date}/{hour}', [TimeslotController::class, 'getTimeslotAvailability']);
});

// Gate API Routes
Route::middleware('auth:sanctum')->prefix('gate')->group(function () {
    Route::get('/qr/{bookingId}', [GateController::class, 'getQrCode']); // Carrier only
    Route::post('/scan', [GateController::class, 'scanQrCode']); // Operator only
    Route::post('/complete', [GateController::class, 'completeShipment']); // Operator only
});

// Schedule routes
Route::get('/schedule/{startDate}/{endDate}', [AdminController::class, 'getSchedule']); // Today
Route::get('/schedule/{date}', [AdminController::class, 'getScheduleByDate']); // Specific date
Route::get('/schedule/{startDate}/{endDate}', [AdminController::class, 'getSchedule']); // Date range

// Data routes
Route::get('/data/logs/{startDate}/{endDate}', [AdminController::class, 'getLogs']);
Route::get('/data/schedule/{date}', [AdminController::class, 'getScheduleByDate']);

// Config routes
Route::post('/config/capacity', [AdminController::class, 'updateCapacity']);

Route::prefix('internal/tools')->group(function () {
    Route::post('/booking-status', [InternalToolsController::class, 'getBookingStatus']);
    Route::post('/user-bookings', [InternalToolsController::class, 'getUserBookings']);
    Route::post('/port-schedule', [InternalToolsController::class, 'getPortSchedule']);
    Route::post('/available-slots', [InternalToolsController::class, 'getAvailableSlots']);
});

Route::middleware('auth:sanctum')->prefix('chat')->group(function () {
    Route::get('/', [ChatController::class, 'createChat']);
    Route::get('/user', [ChatController::class, 'getUserChats']);
    Route::get('/{chatId}/messages', [ChatController::class, 'getChatMessages']);
    Route::delete('/{chatId}', [ChatController::class, 'deleteChat']);
});

// AI API Routes
Route::middleware('auth:sanctum')->prefix('ai')->group(function () {
    Route::post('/generate', [AIController::class, 'generateMessage']);
});
