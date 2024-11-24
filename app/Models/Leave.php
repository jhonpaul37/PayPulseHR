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
        'employee_id',
        'office_unit',
        'request_date',
        'from_date',
        'to_date',
        'total_days',
        'leave_type',
    ];
        protected $casts = [
        'leave_type' => 'array', // leave_type as an array
    ];
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
