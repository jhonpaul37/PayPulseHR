<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeLoanPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_loan_id',
        'amount',
        'payment_date'
    ];

    public function employeeLoan()
    {
        return $this->belongsTo(EmployeeLoan::class);
    }

    public function loan()
    {
        return $this->belongsTo(EmployeeLoan::class, 'employee_loan_id');
    }

}
