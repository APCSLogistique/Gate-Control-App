<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timeslot extends Model
{

    protected $guarded = [];
    protected $casts = [
        'date' => 'date',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'timeslot_id', 'timeslot_id');
    }
}
