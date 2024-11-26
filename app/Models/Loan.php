<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable =
    [
        'employee_id',
        'amount',
        'loan_date',
        'interest_rate',
        'due_date',
        'status'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function payments()
    {
        return $this->hasMany(EmployeeLoanPayment::class, 'employee_loan_id');
    }

}
