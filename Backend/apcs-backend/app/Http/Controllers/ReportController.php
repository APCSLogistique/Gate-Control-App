<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Booking;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * POST /api/report
     * Requires Transiter/Operator auth
     * Creates an incident linked to a booking
     */
    public function createIncident(Request $request)
    {
        // Check transiter or operator role
        if (!in_array(Auth::user()->role, ['transiter', 'operator'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'message' => 'required|string',
        ]);

        $incident = Incident::create([
            'booking_id' => $request->booking_id,
            'reporter_id' => Auth::user()->user_id,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        // Log new incident
        Log::create([
            'code' => 'NEW_INCIDENT',
            'message' => "New incident reported for booking {$request->booking_id}: {$request->message}",
        ]);

        return response()->json([
            'message' => 'Incident reported successfully',
            'incident_id' => $incident->id,
        ], 201);
    }

    /**
     * GET /api/report/:date
     * Requires Admin auth
     * Returns the incidents that happened for that day
     */
    public function getIncidentsByDate($date)
    {
        // Check admin role
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $incidents = Incident::whereDate('created_at', $date)
            ->with('booking')
            ->get()
            ->map(function ($incident) {
                return [
                    'incident_id' => $incident->id,
                    'booking_id' => $incident->booking_id,
                    'message' => $incident->message,
                    'status' => $incident->status,
                    'response' => $incident->response,
                    'created_at' => $incident->created_at,
                    'resolved_at' => $incident->resolved_at,
                ];
            });

        return response()->json([
            'date' => $date,
            'incidents' => $incidents,
        ]);
    }

    /**
     * POST /api/report/solve
     * Requires Admin auth
     * Marks incident as resolved
     */
    public function solveIncident(Request $request)
    {
        // Check admin role
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'incident_id' => 'required|exists:incidents,incident_id',
            'status' => 'required|in:pending,resolved',
            'response' => 'nullable|string',
        ]);

        $incident = Incident::find($request->incident_id);

        $incident->status = $request->status;
        $incident->response = $request->response;

        if ($request->status === 'resolved') {
            $incident->resolved_at = Carbon::now();
        }

        $incident->save();

        return response()->json([
            'message' => 'Incident status updated successfully',
            'incident_id' => $incident->incident_id,
            'status' => $incident->status,
        ]);
    }

    /**
     * GET /api/report/pending
     * Returns all pending incidents
     */
    public function getPendingIncidents()
    {
        // Check admin, carrier, or operator role
        if (!in_array(Auth::user()->role, ['admin', 'carrier', 'operator'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $incidents = Incident::where('status', 'pending')
            ->with('booking')
            ->get()
            ->map(function ($incident) {
                return [
                    'incident_id' => $incident->incident_id,
                    'booking_id' => $incident->booking_id,
                    'message' => $incident->message,
                    'type' => $incident->booking->status ?? 'unknown',
                    'created_at' => $incident->created_at,
                ];
            });

        return response()->json($incidents);
    }
}
