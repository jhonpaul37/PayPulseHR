<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\LoanType;
use App\Models\Benefit;
use App\Models\EmployeeLoan;
use App\Models\EmployeeLoanPayment;
use App\Models\Loan;
use App\Models\Transaction;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{

public function payrollData()
{
    // Filter employee classification
    $employees = Employee::with([
        'loans',
        'loans.payments',
        'salaryGrade',
        'benefits',
        'contributions',
        'position',
        'department',
    ])->whereIn('classification', ['Regular', 'Casual'])->get();

    $loanTypes = LoanType::all();
    $benefits = Benefit::all();
    $transaction = Transaction::all();
    $loanPayment = EmployeeLoanPayment::all();

    foreach ($employees as $employee) {
        // Calculate remaining loan amortization
        foreach ($employee->loans as $loan) {
            // Use the pre-calculated total paid from the loan payments
            $totalPaid = $loan->payments->sum('amount');

            // Use total_paid directly as the remaining amount, no need for recalculation
            $remainingAmount = $loan->total_paid - $totalPaid;

            // Set the remaining amortization
            $loan->remainingAmortization = $remainingAmount > 0 ? min($remainingAmount, $loan->monthly_amortization) : null;
        }

        // Calculate Gross Salary
        $peraAmount = 0;
        $lwopPeraAmount = 0;
        $netPera = 0;
        $rataAmount = 0;
        $salaryDifferentialAmount = 0;

        foreach ($employee->benefits as $benefit) {
            if ($benefit->name === 'PERA') {
                $peraAmount = $benefit->pivot->amount;
            } elseif ($benefit->name === 'LWOP-PERA') {
                $lwopPeraAmount = $benefit->pivot->amount;
            } elseif ($benefit->name === 'RATA') {
                $rataAmount = $benefit->pivot->amount;
            } elseif ($benefit->name === 'SALARY DIFFERENTIAL') {
                $salaryDifferentialAmount = $benefit->pivot->amount;
            }
        }

        // Calculate NET PERA
        $netPera = $peraAmount - $lwopPeraAmount;

        // Calculate TOTAL SALARY (Basic + Benefits)
        $totalSalary = $employee->salaryGrade->monthly_salary + $netPera + $rataAmount + $salaryDifferentialAmount;

        // Calculate total loan amortization (remaining)
        $loanTotal = $employee->loans->reduce(function ($sum, $loan) {
            return $sum + ($loan->remainingAmortization ?? 0);
        }, 0);

        // Separate PATEV contributions
        $patevContribution = 0;
        $otherContributionsTotal = 0;

        foreach ($employee->contributions as $contribution) {
            if ($contribution->name === 'PATVE CONT.') {
                // Separate PATEV
                $patevContribution = $contribution->pivot->amount;
            } else {
                // Contributions total
                $otherContributionsTotal += $contribution->pivot->amount;
            }
        }

        // Total Contributions (except PATEV)
        $totalContributions = $otherContributionsTotal;

        // Include PATEV to total deductions
        $totalDeductions = $loanTotal + $totalContributions + $patevContribution;

        // Calculate Net Amount (Total Salary - Total Deductions)
        $netAmount = $totalSalary - $totalDeductions;

        // Calculate NET PAY 1-15
        $netPay1To15 = $netAmount / 2;

        // Computed properties
        $employee->net_pera = $netPera;
        $employee->total_salary = $totalSalary;
        $employee->total_loans = $loanTotal; // Total loan amount
        $employee->total_contributions = $totalContributions; // Add total contributions excluding PATEV
        $employee->total_patev_contribution = $patevContribution; // Separately PATEV
        $employee->total_deductions = $totalDeductions; // Total deductions including (PATEV)
        $employee->total_payable = $totalSalary - $employee->total_deductions; // Payable after deductions
        $employee->net_amount = $netAmount;
        $employee->net_pay = $netPay1To15;
    }

    return Inertia::render('Payroll/PayrollData', [
        'employee' => $employees,
        'loanTypes' => $loanTypes,
        'benefits' => $benefits,
        'transaction' => $transaction,
        'loanPayment' => $loanPayment,
    ]);
}


    public function generalPayroll()
    {
        $payrolls = Payroll::with('employee')->get();
        $employees = Employee::with(['loans', 'loans.payments', 'salaryGrade'])->get();
        $loanTypes = LoanType::all();


        foreach ($employees as $employee) {
            foreach ($employee->loans as $loan) {
                // Sum all payments made for this loan
                $totalPaid = $loan->payments->sum('amount');
                // Cal remaining amount after payments
                $remainingAmount = $loan->amount - $totalPaid;

                // If remaining amount < 0, set the remaining amortization
                if ($remainingAmount > 0) {
                    // Check remaining amount is > monthly amortization
                    $loan->remainingAmortization = min($remainingAmount, $loan->monthly_amortization);
                } else {
                    $loan->remainingAmortization = null; // Loan paid
                }
            }
        }

        return Inertia::render('Payroll/GeneralPayroll', [
            'payrolls' => $payrolls,
            'employee' => $employees,
            'loanTypes' => $loanTypes,
        ]);
    }



    // PayrollController.php

public function store(Request $request)
{
    $validated = $request->validate([
        'pay_period_start' => 'required|date',
        'pay_period_end' => 'required|date',
        'pay_date' => 'required|date',
        'employees' => 'required|array',
        'employees.*.employee_id' => 'required|exists:employees,id',
        // Add other validation rules
    ]);

    // Create the payroll
    $payroll = Payroll::create([
        'pay_period_start' => $validated['pay_period_start'],
        'pay_period_end' => $validated['pay_period_end'],
        'pay_date' => $validated['pay_date'],
        // Other payroll fields
    ]);

    // Add payroll items for each employee
    foreach ($validated['employees'] as $employeeData) {
        $payrollEmployee = $payroll->employees()->create([
            'employee_id' => $employeeData['employee_id'],
            'basic_salary' => $employeeData['basic_salary'],
            'gross_earnings' => $employeeData['gross_earnings'],
            'total_deductions' => $employeeData['total_deductions'],
            'net_pay' => $employeeData['net_pay'],
        ]);

        // Add earnings
        foreach ($employeeData['earnings'] as $earning) {
            $payrollEmployee->earnings()->create([
                'benefit_id' => $earning['benefit_id'],
                'amount' => $earning['amount'],
            ]);
        }

        // Add deductions
        foreach ($employeeData['deductions'] as $deduction) {
            $payrollEmployee->deductions()->create([
                'deduction_id' => $deduction['deduction_id'],
                'deduction_type' => $deduction['type'],
                'amount' => $deduction['amount'],
            ]);
        }

        // Add loan payments
        foreach ($employeeData['loans'] as $loan) {
            $payrollEmployee->loanPayments()->create([
                'employee_loan_id' => $loan['loan_id'],
                'amount' => $loan['amount'],
            ]);
        }
    }

    return redirect()->route('payrolls.show', $payroll)
        ->with('message', 'Payroll created successfully');
}

}
