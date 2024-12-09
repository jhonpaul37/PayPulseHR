<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\EmployeeLoanPayment;
use App\Models\Employee;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

public function store(Request $request)
{
    $data = $request->input('data');

    foreach ($data as $employeeData) {
        $employee = Employee::where('id', $employeeData['id'])->first();

        if ($employee) {
            // Process loans
            foreach ($employeeData['loans'] as $loanData) {
                $loan = $employee->loans()->find($loanData['loan_id']);

                if ($loan && isset($loanData['remaining_amortization'])) {
                    $deductionAmount = (float) $loanData['remaining_amortization'];

                    // Create a new loan payment
                    EmployeeLoanPayment::create([
                        'employee_loan_id' => $loan->id,
                        'amount' => $deductionAmount,
                        'payment_date' => now(),
                    ]);

                    // Calculate total paid and update loan status
                    $totalPaid = $loan->payments()->sum('amount');

                    if ($totalPaid >= $loan->total_paid) {
                        $loan->status = 'completed';
                    } else {
                        $loan->status = 'active';
                    }

                    $loan->save();
                }
            }

            // Process contributions, benefits, etc.
            foreach ($employeeData['contributions'] as $contributionData) {
                // Handle saving contributions
            }

            foreach ($employeeData['benefits'] as $benefitData) {
                // Handle saving benefits
            }

            // Add any other data processing (e.g., total salary, net pay)
        }
    }

    // Generate a unique reference number
    $transaction = Transaction::create([
        'reference_number' => 'BSC-' . strtoupper(uniqid()),
        'data' => json_encode($data),
    ]);

    return Inertia::render('Payroll/FinalPayroll', [
        'message' => 'Transaction saved successfully!',
        'reference_number' => $transaction->reference_number,
    ]);
}


    public function show($referenceNumber)
    {
        $transaction = Transaction::where('reference_number', $referenceNumber)->first();

        if (!$transaction) {
            abort(404, 'Transaction not found');
        }

        $data = json_decode($transaction->data, true);
        return Inertia::render('Payroll/FinalPayroll', [
            'transaction' => $transaction,
            'data' => $data,
        ]);
    }

}
