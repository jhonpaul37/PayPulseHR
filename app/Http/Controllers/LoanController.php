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

    // public function Loans2()
    // {
    //     $loanTypes = LoanType::with('loanProgram')->get();
    //     $loanPrograms = ProgramLoan::all();
    //     $employees = Employee::all();
    //     $employeeLoan = EmployeeLoan::with(['employee', 'loanType', 'payments'])->get();

    //     // Calculate loan details including total amount, paid amount, and remaining balance
    //     $employeeLoanData = $employeeLoan->map(function ($loan) {
    //         $totalAmount = $loan->amount;
    //         $interest = $loan->interest_rate / 100;  // Assuming interest_rate is in percentage
    //         $totalWithInterest = $totalAmount + ($totalAmount * $interest);  // Total loan including interest

    //         // Calculate the total paid amount
    //         $totalPaid = $loan->payments->sum(function ($payment) {
    //             return (float)$payment->amount;  // Sum of all payments
    //         });

    //         // Calculate remaining balance
    //         $remainingBalance = $totalWithInterest - $totalPaid;

    //         return [
    //             'loan' => $loan,
    //             'totalWithInterest' => $totalWithInterest,
    //             'totalPaid' => $totalPaid,
    //             'remainingBalance' => $remainingBalance,
    //         ];
    //     });

    //     return Inertia::render('Loans/Loans', [
    //         'loanPrograms' => $loanPrograms,
    //         'loanTypes' => $loanTypes,
    //         'employees' => $employees,
    //         'employeeLoan' => $employeeLoanData,  // Pass the calculated data
    //     ]);
    // }

}
