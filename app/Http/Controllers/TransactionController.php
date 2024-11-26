<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Payroll;
use App\Models\Loan;
use App\Models\EmployeeLoanPayment;
use App\Models\Employee;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    // public function store(Request $request)
    // {
    //     $data = $request->validate([
    //         'data' => 'required|array',
    //     ]);

    //     // Generate unique reference number
    //     $transaction = Transaction::create([
    //         'reference_number' => 'BSC-' . strtoupper(uniqid()),
    //         'data' => json_encode($data['data']),
    //     ]);

    //     return Inertia::render('Payroll/PayrollData', [
    //         'message' => 'Transaction saved successfully!',
    //         'reference_number' => $transaction->reference_number,
    //     ]);
    // }



// public function store(Request $request)
// {
//     $data = $request->validate([
//         'data' => 'required|array',
//     ]);

//     // Loop through each employee in the data
//     foreach ($data['data'] as &$employee) {
//         // Check if the employee has loans and deduct the remaining amortization
//         if (isset($employee['loans']) && is_array($employee['loans'])) {
//             foreach ($employee['loans'] as &$loan) {
//                 // Calculate the remaining amortization or deduction
//                 $remainingAmortization = $loan['remaining_amortization'] ?? 0;
//                 if ($remainingAmortization > 0) {
//                     // Deduct a certain percentage or amount from the loan
//                     // Example: deduct 10% of the remaining amortization
//                     $deduction = $remainingAmortization * 0.10;
//                     $loan['remaining_amortization'] -= $deduction; // Apply deduction

//                     // Make sure the loan doesn't go below 0
//                     $loan['remaining_amortization'] = max(0, $loan['remaining_amortization']);
//                 }
//             }
//         }
//     }

//     // Generate unique reference number
//     $transaction = Transaction::create([
//         'reference_number' => 'BSC-' . strtoupper(uniqid()),
//         'data' => json_encode($data['data']),
//     ]);

//     return Inertia::render('Payroll/PayrollData', [
//         'message' => 'Transaction saved successfully!',
//         'reference_number' => $transaction->reference_number,
//     ]);
// }



public function store(Request $request)
{
    $data = $request->input('data');  // Get payroll data from the request

    foreach ($data as $employeeData) {
        // Find employee using employee_no
        $employee = Employee::where('id', $employeeData['id'])->first();

        if ($employee) {
            // Process loans deduction
            foreach ($employeeData['loans'] as $loanData) {
                // Find the loan associated with the employee
                $loan = $employee->loans()->find($loanData['loan_id']);

                if ($loan && isset($loanData['remaining_amortization'])) {
                    // Deduction amount
                    $deductionAmount = (float) $loanData['remaining_amortization'];

                    // Create a loan payment entry
                    EmployeeLoanPayment::create([
                        'employee_loan_id' => $loan->id,
                        'amount' => $deductionAmount,
                        'payment_date' => now(),
                    ]);

                    // Update the loan's remaining balance
                    $loan->save();
                }
            }
        }
    }

    // Generate unique reference number
    $transaction = Transaction::create([
        'reference_number' => 'BSC-' . strtoupper(uniqid()),
        'data' => json_encode($data),  // No need to use $data['data']
    ]);

    return Inertia::render('Payroll/PayrollData', [
        'message' => 'Transaction saved successfully!',
        'reference_number' => $transaction->reference_number,
    ]);
}


}
