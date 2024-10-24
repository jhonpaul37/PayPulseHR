<?php

namespace App\Http\Controllers;

use App\Models\EmployeeLoan;
use App\Models\Employee;
use App\Models\LoanType;
use Illuminate\Http\Request;

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
        ]);

        $monthlyAmortization = $this->calculateAmortization($request->amount, $request->interest_rate, $request->months);

        EmployeeLoan::create([
            'employee_id' => $request->employee_id,
            'loan_type_id' => 1,
            'amount' => $request->amount,
            'loan_date' => $request->loan_date,
            'interest_rate' => $request->interest_rate,
            'months' => $request->months,
            'monthly_amortization' => $monthlyAmortization,
        ]);

        return redirect()->route('loans.view');
    }

    public function calculateAmortization($amount, $interestRate, $months)
    {
        $rate = ($interestRate / 100) / 12;
        return ($amount * $rate) / (1 - pow(1 + $rate, -$months));
    }

    public function destroy(EmployeeLoan $employeeLoan)
    {
        $employeeLoan->delete();
        return redirect()->route('employee-loans.index');
    }
}
