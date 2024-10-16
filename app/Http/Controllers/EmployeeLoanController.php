<?php

namespace App\Http\Controllers;

use App\Models\EmployeeLoan;
use App\Models\Employee;
use App\Models\LoanPlan;
use Illuminate\Http\Request;

class EmployeeLoanController extends Controller
{

    public function create()
    {
        $employees = Employee::all();
        $loanPlans = LoanPlan::with('loanType')->get();
        return inertia('Loans/EmployeeLoanForm', [
            'employees' => $employees,
            'loanPlans' => $loanPlans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'loan_plan_id' => 'required|exists:loan_plans,id',
            'amount' => 'required|numeric|min:0',
            'loan_date' => 'required|date',
        ]);

        $loanPlan = LoanPlan::find($request->loan_plan_id);
        $monthlyAmortization = $this->calculateAmortization($request->amount, $loanPlan->interest_rate, $loanPlan->months);

        EmployeeLoan::create([
            'employee_id' => $request->employee_id,
            'loan_plan_id' => $request->loan_plan_id,
            'amount' => $request->amount,
            'loan_date' => $request->loan_date,
            'monthly_amortization' => $monthlyAmortization,
        ]);

        return redirect()->route('employee-loans.index');
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
