<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;
    protected $table = 'leave_requests';

    protected $fillable = [
        'requestor_name',
        'office_unit',
        'request_date',
        'from_date',
        'to_date',
        'total_days',
        'leave_type',
    ];
        protected $casts = [
        'leave_type' => 'array', // Cast leave_type as an array
    ];
}
