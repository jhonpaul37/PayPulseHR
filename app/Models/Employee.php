<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;


    protected $fillable = [
        'employee_id',
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
        'roles',
        'termination_date',
        'termination_reason',
        'photo_url',
        'user_id',
    ];
    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(Leave::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function loans()
    {
        return $this->hasMany(EmployeeLoan::class, 'employee_id');
    }

}
