<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\LoanType;
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

public function generalPayroll()
{
    $payrolls = Payroll::with('employee')->get();
    $employees = Employee::with(['loans', 'loans.payments'])->get();
    $loanTypes = LoanType::all();

    // Calculate remaining amortization for each loan
    foreach ($employees as $employee) {
        foreach ($employee->loans as $loan) {
            // Sum all payments made for this loan
            $totalPaid = $loan->payments->sum('amount');
            // Calculate remaining amount after payments
            $remainingAmount = $loan->amount - $totalPaid;

            // If remaining amount is greater than 0, set the remaining amortization
            if ($remainingAmount > 0) {
                // Check if remaining amount is less than monthly amortization
                $loan->remainingAmortization = min($remainingAmount, $loan->monthly_amortization);
            } else {
                $loan->remainingAmortization = null; // Loan fully paid
            }
        }
    }

    return Inertia::render('Payroll/GeneralPayroll', [
        'payrolls' => $payrolls,
        'employee' => $employees,
        'loanTypes' => $loanTypes,
    ]);
}




    public function payrollData()
    {
        $payrolls = Payroll::with('employee')->get();
        $employee = Employee::get();

        return Inertia::render('Payroll/PayrollData', [
            'payrolls' => $payrolls, 'employee' => $employee
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


//     public function calculateDeductions($employee)
//     {
//         $taxRate = 0.1;
//         $insuranceDeduction = 100;

//         $basicSalary = $employee->salary;

//         $taxDeduction = $basicSalary * $taxRate;
//         $totalDeductions = $taxDeduction + $insuranceDeduction;

//         return $totalDeductions;
// }
//     public function calculateBonuses($employee)
//     {
//         $performanceBonus = 200;

//         return $performanceBonus;
//     }


//     public function calculatePayroll($employee)
//     {
//         $basicSalary = $employee->salary;
//         $deductions = $this->calculateDeductions($employee);
//         $bonuses = $this->calculateBonuses($employee);

//         $netSalary = $basicSalary - $deductions + $bonuses;

//         return $netSalary;
//     }

//     public function store(Request $request)
//     {
//         $request->validate([
//             'employee_id' => 'required',
//             'basic_salary' => 'required|numeric',
//             'deductions' => 'nullable|numeric',
//             'bonuses' => 'nullable|numeric',
//         ]);

//         $netSalary = $request->basic_salary - $request->deductions + $request->bonuses;

//         Payroll::create([
//             'employee_id' => $request->employee_id,
//             'pay_date' => now(),
//             'basic_salary' => $request->basic_salary,
//             'deductions' => $request->deductions,
//             'bonuses' => $request->bonuses,
//             'net_salary' => $netSalary,
//         ]);

//         return redirect()->back()->with('message', 'Payroll processed successfully');
//     }

}
