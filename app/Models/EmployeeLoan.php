<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeLoan extends Model
{
    use HasFactory;

    protected $table = 'employee_loans';

    protected $fillable = [
        'employee_id',
        'loan_type_id',
        'amount',
        'loan_date',
        'interest_rate',
        'months',
        'monthly_amortization',
        'status',
        'total_paid'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function loanType()
    {
        return $this->belongsTo(LoanType::class);
    }

    public function payments()
    {
        return $this->hasMany(EmployeeLoanPayment::class, 'employee_loan_id');
    }

}
