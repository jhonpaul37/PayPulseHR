<?php

namespace App\Http\Controllers;

use App\Models\EmployeeLoan;
use App\Models\Employee;
use App\Models\LoanType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeeLoanController extends Controller
{

    public function create()
    {
        $employees = Employee::all();
        $loanTypes = LoanType::with('loanProgram')->get();

        return inertia('Loans/EmployeeLoanForm', [
            'employees' => $employees,
            'loanTypes' => $loanTypes ?? [],
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'loan_type_id' => 'required|exists:loans_types,id',
            'amount' => 'required|numeric|min:0',
            'loan_date' => 'required|date',
            'interest_rate' => 'required|numeric|min:0',
            'months' => 'required|integer|min:1',
            'monthly_amortization' => 'required|numeric|min:0',
            'total_paid' => 'required|numeric|min:0',
        ]);

        EmployeeLoan::create([
            'employee_id' => $request->employee_id,
            'loan_type_id' => $request->loan_type_id,
            'amount' => $request->amount,
            'loan_date' => $request->loan_date,
            'interest_rate' => $request->interest_rate,
            'months' => $request->months,
            'monthly_amortization' => $request->monthly_amortization,
            'total_paid' => $request->total_paid,
        ]);

        return redirect()->route('loans.view');
    }

// public function store(Request $request)
// {
//     $request->validate([
//         'employee_id' => 'required|exists:employees,id',
//         'loan_type_id' => 'required|exists:loans_types,id',
//         'amount' => 'required|numeric|min:0',
//         'loan_date' => 'required|date',
//         'interest_rate' => 'required|numeric|min:0',
//         'months' => 'required|integer|min:1',
//         'monthly_amortization' => 'required|numeric|min:0',
//     ]);

//     // Calculate total paid using the simple interest formula: A = P(1 + rt)
//     $principal = $request->amount;
//     $rate = $request->interest_rate / 100; // Convert percentage to decimal
//     $time = $request->months / 12; // Convert months to years
//     $totalPaid = $principal * (1 + ($rate * $time));

//     // Calculate monthly amortization (assuming it's recalculated based on total_paid)
//     $monthlyAmortization = $totalPaid / $request->months;

//     EmployeeLoan::create([
//         'employee_id' => $request->employee_id,
//         'loan_type_id' => $request->loan_type_id,
//         'amount' => $request->amount,
//         'loan_date' => $request->loan_date,
//         'interest_rate' => $request->interest_rate,
//         'months' => $request->months,
//         'monthly_amortization' => $monthlyAmortization,
//         'total_paid' => $totalPaid,
//     ]);

//     return redirect()->route('loans.view');
// }


    public function calculateAmortization($amount, $interestRate, $months)
    {
        $rate = ($interestRate / 100) / 12;
        return ($amount * $rate) / (1 - pow(1 + $rate, -$months));
    }


    public function addPayment(Request $request, EmployeeLoan $employeeLoan)
    {
        $remainingBalance = max(0, $employeeLoan->amount - $employeeLoan->payments->sum('amount'));
        $minPaymentAmount = min($employeeLoan->monthly_amortization, $remainingBalance);

        $request->validate([
            'amount' => "required|numeric|min:$minPaymentAmount",
            'payment_date' => 'required|date',
        ]);

        $employeeLoan->payments()->create([
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
        ]);

        return redirect()->route('loan.details', $employeeLoan->id)
            ->with('success', 'Payment added successfully.');
    }


    public function show(EmployeeLoan $employeeLoan)
    {
        $employeeLoan->load(['employee', 'loanType', 'payments']);

        return inertia('Loans/EmployeeLoanDetail', [
            'employeeLoan' => $employeeLoan,
            'payments' => $employeeLoan->payments,
        ]);
    }

public function myLoans()
{
    $user = Auth::user();
    $employeeId = $user->employee->id;

    // Fetch loans and include relationships
    $loans = EmployeeLoan::with(['loanType', 'payments'])
        ->where('employee_id', $employeeId)
        ->get();

    // Filter based on the `status` field
    $activeLoans = $loans->where('status', 'active');
    $fullyPaidLoans = $loans->where('status', 'completed');

    $remainingBalance = $activeLoans->sum(function ($loan) {
        $totalPaid = $loan->payments->sum('amount'); // Sum all payments
        return $loan->total_paid - $totalPaid; // Subtract payments from total loan amount
    });
    // Calculate summary statistics
    $totalActiveLoanAmount = $activeLoans->sum('total_paid');

    $totalPaidLoanAmount = $fullyPaidLoans->sum('total_paid');
    $totalLoanAmount = $totalActiveLoanAmount + $totalPaidLoanAmount;

    return inertia('Loans/MyLoans', [
        'auth' => ['user' => $user],
        'loans' => $loans,
        'activeLoans' => $activeLoans->values(),
        'fullyPaidLoans' => $fullyPaidLoans->values(),
        'totalLoanAmount' => $totalLoanAmount,
        'totalPaidLoanAmount' => $totalPaidLoanAmount,
        'totalActiveLoanAmount' => $totalActiveLoanAmount,
        'remainingBalance' => $remainingBalance,
    ]);
}



    // Display the edit form
    public function edit(EmployeeLoan $employeeLoan)
    {
        $employeeLoan->load(['employee', 'loanType']);
        $loanTypes = LoanType::all(); // Assuming you want to allow changing the loan type

        return inertia('Loans/EditEmployeeLoan', [
            'employeeLoan' => $employeeLoan,
            'loanTypes' => $loanTypes,
        ]);
    }

    // Update the loan details
    public function update(Request $request, EmployeeLoan $employeeLoan)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'loan_date' => 'required|date',
            'interest_rate' => 'required|numeric|min:0',
            'months' => 'required|integer|min:1',
            'monthly_amortization' => 'required|numeric|min:0',
        ]);

        $monthlyAmortization = $this->calculateAmortization($request->amount, $request->interest_rate, $request->months);

        $employeeLoan->update([
            'amount' => $request->amount,
            'loan_date' => $request->loan_date,
            'interest_rate' => $request->interest_rate,
            'months' => $request->months,
            'monthly_amortization' => $monthlyAmortization,
        ]);

        return redirect()->route('loan.details', $employeeLoan->id)
            ->with('success', 'Loan updated successfully.');
    }

}
