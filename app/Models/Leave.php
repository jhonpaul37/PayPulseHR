<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;
    protected $table = 'leave_requests';

    protected $fillable = [
        'employee_id',
        'requestor_name',
        'office_unit',
        'request_date',
        'leave_type',
        'other_leave_type',
        'from_date',
        'to_date',
        'total_days',
        'status',
    ];

    protected $casts = [
        'leave_type' => 'array',
        'from_date' => 'date',
        'to_date' => 'date',
        'request_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
