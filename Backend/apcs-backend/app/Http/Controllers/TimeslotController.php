<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Config;
use App\Models\Timeslot;
use Illuminate\Http\Request;

class TimeslotController extends Controller
{
    public function getTimeslotAvailability($date, $hour)
    {
        $config = Config::first();

        $timeslot = Timeslot::where('date', $date)
            ->where('hour_start', $hour)
            ->first();

        if (!$timeslot) {
            return response()->json([
                'max_capacity' => $config->capacity,
                'used_capacity' => 0,
                'late_capacity' => $config->late_capacity,
            ]);
        }

        $usedCapacity = Booking::where('timeslot_id', $timeslot->id)
            ->whereIn('status', ['pending', 'in']) // only active bookings
            ->count();

        return response()->json([
            'max_capacity' => $timeslot->capacity,
            'used_capacity' => $usedCapacity,
            'late_capacity' => $timeslot->late_capacity,
        ]);
    }
}
