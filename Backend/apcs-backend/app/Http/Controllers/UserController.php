<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function Register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['password'] = bcrypt($validated['password']);
            $user = User::create($validated);
            return response()->json([
                'message' => 'User registered successfully',
                'user' => new UserResource($user),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();
        if ($user && Hash::check($validated['password'], $user->password)) {

            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'user' => new UserResource($user),
                'token' => $token,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }
    }

    public function getProfile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user_id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]);
    }
    public function getUserBookings(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->user_id)
            ->with('timeslot')
            ->get()
            ->map(function ($booking) {
                return [
                    'booking_id' => $booking->id,
                    'truck_number' => $booking->truck_number,
                    'timeslot' => [
                        'date' => $booking->timeslot->date,
                        'hour_start' => $booking->timeslot->hour_start,
                    ],
                    'status' => $booking->status,
                    'created_at' => $booking->created_at,
                ];
            });

        return response()->json($bookings);
    }
}
