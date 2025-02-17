<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Employee;
use App\Models\LoanType;
use App\Models\ProgramLoan;
use App\Models\EmployeeLoan;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LoanController extends Controller
{

    public function Loans()
    {
        $loanTypes = LoanType::with('loanProgram')->get();
        $loanPrograms = ProgramLoan::all();
        $employees = Employee::all();
        $transaction = Transaction::all();
        // $employeeLoan = EmployeeLoan::with(['employee', 'loanType', 'payments'])->get();
        $employeeLoan = EmployeeLoan::with(['employee', 'loanType', 'payments'])
                            ->where('status', '!=', 'completed')
                            ->get();


        return Inertia::render('Loans/Loans', [
            'loanPrograms' => $loanPrograms,
            'loanTypes' => $loanTypes,
            'employees' => $employees,
            'employeeLoan' => $employeeLoan,
            'transaction' => $transaction,
        ]);
    }

}
