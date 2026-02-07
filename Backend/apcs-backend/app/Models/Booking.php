<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function timeslot()
    {
        return $this->belongsTo(Timeslot::class, 'timeslot_id');
    }

    public function qrCode()
    {
        return $this->hasOne(QrCode::class, 'booking_id', 'id');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class, 'booking_id', 'id');
    }
}
