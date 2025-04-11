<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Loan;
use App\Models\EmployeeLoan;
use Inertia\Inertia;

class RemittanceController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        $employeeLoan = EmployeeLoan::with(['employee', 'loanType', 'payments'])
                            ->where('status', '!=', 'completed')
                            ->get();
        return Inertia::render('Remittance/remittance', [
            'employees' => $employees,
            'employeeLoan' => $employeeLoan,
        ]);
    }

}
