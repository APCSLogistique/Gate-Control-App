<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Timeslot;
use Illuminate\Http\Request;

class Internaltoolscontroller extends Controller
{
    public function getBookingStatus(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|string',
            'user_id' => 'required|string',
        ]);

        $booking = Booking::with('timeslot')
            ->where('booking_id', $request->id)
            ->where('user_id', $request->id)
            ->first();

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        return response()->json([
            'booking_id' => $booking->id,
            'timeslot' => [
                'date' => $booking->timeslot->date,
                'hour_start' => $booking->timeslot->hour_start,
            ],
            'status' => $booking->status,
        ]);
    }

    public function getUserBookings(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'date' => 'nullable|date',
            'hour' => 'nullable|string',
        ]);

        $query = Booking::with('timeslot')
            ->where('user_id', $request->user_id);

        // Filter by date if provided
        if ($request->has('date') && $request->date) {
            $query->whereHas('timeslot', function ($q) use ($request) {
                $q->where('date', $request->date);
            });
        }

        // Filter by hour if provided
        if ($request->has('hour') && $request->hour) {
            $query->whereHas('timeslot', function ($q) use ($request) {
                $q->where('hour_start', $request->hour);
            });
        }

        $bookings = $query->get()->map(function ($booking) {
            return [
                'booking_id' => $booking->id,
                'timeslot' => [
                    'date' => $booking->timeslot->date,
                    'hour_start' => $booking->timeslot->hour_start,
                ],
                'status' => $booking->status,
            ];
        });

        return response()->json($bookings);
    }

    public function getPortSchedule(Request $request)
    {
        $request->validate([
            'terminal_id' => 'nullable|string',
            'date' => 'required|date',
            'user_id' => 'required|string',
            'user_role' => 'required|in:carrier,operator,admin',
        ]);

        // Get timeslots for the date
        $timeslots = Timeslot::where('date', $request->date)
            ->orderBy('hour_start')
            ->get();

        $schedule = $timeslots->map(function ($slot) {
            $bookedCapacity = Booking::where('timeslot_id', $slot->id)
                ->whereIn('status', ['pending', 'in'])
                ->count();

            return [
                'hour_start' => $slot->hour_start,
                'max_capacity' => $slot->capacity,
                'booked_capacity' => $bookedCapacity,
                'late_capacity' => $slot->late_capacity,
            ];
        });

        return response()->json([
            'date' => $request->date,
            'schedule' => $schedule,
        ]);
    }

    /**
     * POST /api/internal/tools/available-slots
     * Gets available time slots for booking
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $timeslots = Timeslot::where('date', $request->date)
            ->orderBy('hour_start')
            ->get();

        $availableSlots = $timeslots->filter(function ($slot) {
            $bookedCapacity = Booking::where('timeslot_id', $slot->id)
                ->whereIn('status', ['pending', 'in'])
                ->count();

            return $bookedCapacity < $slot->capacity;
        })->map(function ($slot) {
            $bookedCapacity = Booking::where('timeslot_id', $slot->id)
                ->whereIn('status', ['pending', 'in'])
                ->count();

            return [
                'hour_start' => $slot->hour_start,
                'max_capacity' => $slot->capacity,
                'available_capacity' => $slot->capacity - $bookedCapacity,
            ];
        });

        return response()->json([
            'date' => $request->date,
            'available_slots' => $availableSlots->values(),
        ]);
    }
}
