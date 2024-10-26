<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Employee;
use App\Models\LoanType;
use App\Models\ProgramLoan;
use App\Models\EmployeeLoan;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LoanController extends Controller
{

    public function Loans()
    {
        $loanTypes = LoanType::with('loanProgram')->get();
        $loanPrograms = ProgramLoan::all();
        $employees = Employee::all();
        $employeeLoan = EmployeeLoan::with(['employee', 'loanType', 'payments'])->get();
        return Inertia::render('Loans/Loans', [
            'loanPrograms' => $loanPrograms,
            'loanTypes' => $loanTypes,
            'employees' => $employees,
            'employeeLoan' => $employeeLoan,
        ]);
    }

}
