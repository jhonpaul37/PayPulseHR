<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\LoanType;
use App\Models\Benefit;
use Inertia\Inertia;
class PayrollController extends Controller
{
    // public function generalPayroll()
    // {
    //     $payrolls = Payroll::with('employee')->get();
    //     $employees = Employee::all();
    //     $loanTypes = LoanType::all();

    //     return Inertia::render('Payroll/GeneralPayroll', [
    //         'payrolls' => $payrolls,
    //         'employee' => $employees,
    //         'loanTypes' => $loanTypes,
    //     ]);
    // }

public function payrollData()
{
    $employees = Employee::with([
        'loans',
        'loans.payments',
        'salaryGrade',
        'benefits',
        'contributions',
    ])->get();

    $loanTypes = LoanType::all();
    $benefits = Benefit::all();

    foreach ($employees as $employee) {
        // Cal remaining loan amortization
        foreach ($employee->loans as $loan) {
            $totalPaid = $loan->payments->sum('amount');
            $remainingAmount = $loan->amount - $totalPaid;

            $loan->remainingAmortization = $remainingAmount > 0
                ? min($remainingAmount, $loan->monthly_amortization)
                : null;
        }

        // Cal benefits
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

        // Cal NET PERA
        $netPera = $peraAmount - $lwopPeraAmount;

        // Cal TOTAL SALARY
        $total = $employee->salaryGrade->monthly_salary + $netPera + $rataAmount + $salaryDifferentialAmount;

        // Cal total deductions
        $totalDeductions = $employee->contributions->reduce(function ($sum, $contribution) {
            return $sum + $contribution->pivot->amount;
        }, 0);

        // Add compute properties
        $employee->net_pera = $netPera;
        $employee->total = $total;
        $employee->total_deductions = $totalDeductions;
    }

    return Inertia::render('Payroll/PayrollData', [
        'employee' => $employees,
        'loanTypes' => $loanTypes,
        'benefits' => $benefits,
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

    public function computation()
    {
        $employee = Employee::all();

        return Inertia::render('Payroll/Computation', [
            'employee' => $employee
        ]);
    }
    public function payroll()
    {
        $payrolls = Payroll::with('employee')->get();
        $employee = Employee::get();

        return Inertia::render('Payroll/Payroll', [
            'payrolls' => $payrolls, 'employee' => $employee
        ]);
    }

}
