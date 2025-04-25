<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeLeaveCredit extends Model
{
    use HasFactory;
    protected $table = 'employee_leave_credits';

    protected $fillable = [
        'employee_id',
        'vacation_leave',
        'sick_leave',
        'special_privilege_leave',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

}
