<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Config;
use App\Models\Log;
use App\Models\Timeslot;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getSchedule($startDate, $endDate)
    {
        // If no dates provided, use today
        if ($startDate === null) {
            $startDate = Carbon::today()->format('Y-m-d');
            $endDate = $startDate;
        }

        // If only one date provided, treat it as both start and end
        if ($endDate === null) {
            $endDate = $startDate;
        }

        $timeslots = Timeslot::whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->orderBy('hour_start')
            ->get();

        // Group by date
        $scheduleByDate = $timeslots->groupBy('date')->map(function ($daySlots, $date) {
            $maxShipments = $daySlots->sum('capacity');
            $bookedAmount = 0;

            $schedule = $daySlots->map(function ($slot) use (&$bookedAmount) {
                $bookedCapacity = Booking::where('timeslot_id', $slot->id)
                    ->whereIn('status', ['pending', 'in'])
                    ->count();

                $bookedAmount += $bookedCapacity;

                return [
                    'hour_start' => $slot->hour_start,
                    'max_capacity' => $slot->capacity,
                    'booked_capacity' => $bookedCapacity,
                ];
            });

            return [
                'date' => $date,
                'max_shipments' => $maxShipments,
                'booked_amount' => $bookedAmount,
                'schedule' => $schedule->values(),
            ];
        });

        return response()->json($scheduleByDate->values());
    }

    public function getLogs($startDate, $endDate)
    {
        $logs = Log::whereBetween('timestamp', [
            Carbon::parse($startDate)->startOfDay(),
            Carbon::parse($endDate)->endOfDay(),
        ])
            ->orderBy('timestamp')
            ->get();

        // Group by date
        $logsByDate = $logs->groupBy(function ($log) {
            return Carbon::parse($log->timestamp)->format('Y-m-d');
        })->map(function ($dayLogs, $date) {
            return [
                'date' => $date,
                'logs' => $dayLogs->map(function ($log) {
                    return [
                        'timestamp' => $log->timestamp,
                        'code' => $log->code,
                        'message' => $log->message,
                    ];
                })->values(),
            ];
        });

        return response()->json($logsByDate->values());
    }

    public function updateCapacity(Request $request)
    {
        $request->validate([
            'capacity' => 'required|integer|min:1',
            'late_capacity' => 'required|integer|min:0',
        ]);

        // Update or create config
        $config = Config::first();

        if (!$config) {
            $config = Config::create([
                'capacity' => $request->capacity,
                'late_capacity' => $request->late_capacity,
            ]);
        } else {
            $config->update([
                'capacity' => $request->capacity,
                'late_capacity' => $request->late_capacity,
            ]);
        }

        // Log configuration change
        Log::create([
            'code' => 'CONFIG_CHANGED',
            'message' => "Terminal capacity changed to {$request->capacity}, late capacity to {$request->late_capacity}",
        ]);

        return response()->json([
            'message' => 'Capacity configuration updated successfully',
            'capacity' => $config->capacity,
            'late_capacity' => $config->late_capacity,
        ]);
    }

    public function getScheduleByDate($date)
    {
        return $this->getSchedule($date, $date);
    }
}
