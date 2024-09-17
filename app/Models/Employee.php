<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;


    protected $fillable = [
        'company_id',
        'first_name',
        'last_name',
        'middle_name',
        'birthdate',
        'sex',
        'civil_status',
        'nationality',
        'address',
        'phone',
        'email',
        'position',
        'department',
        'start_date',
        'employment_type',
        'salary',
        'vacation_days',
        'sick_days',
        'leave_balance',
        'termination_date',
        'termination_reason',
        'photo_url',
    ];
    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

}
