<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeLoan extends Model
{
    use HasFactory;

    protected $table = 'employee_loans';

    protected $fillable = ['employee_id', 'loan_plan_id', 'amount', 'loan_date', 'monthly_amortization'];
}
