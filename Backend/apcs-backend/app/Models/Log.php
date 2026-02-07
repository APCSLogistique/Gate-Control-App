<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $guarded = [];
    protected $casts = [
        'timestamp' => 'datetime',
    ];
    public $timestamps = false; // Using custom timestamp field

}
