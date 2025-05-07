<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\Contribution;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\EmployeeLoanPayment;
use App\Models\Employee;
use App\Models\LoanType;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

public function store(Request $request)
{
    $data = $request->input('data');
    $processedEmployees = [];

    foreach ($data as $employeeData) {
        $employee = Employee::where('id', $employeeData['id'])->first();

        // dd($employeeData);

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


                    $totalPaid = $loan->payments()->sum('amount');

                    if ($totalPaid >= $loan->total_paid) {
                        $loan->status = 'completed';
                    } else {
                        $loan->status = 'active';
                    }
                    $loan->save();
                }
            }

            // PATVE, GSIS, TAX,
            foreach ($employeeData['contributions'] as $contributionData) {
                $employee->contributions()->updateOrCreate(
                    ['contribution_id' => $contributionData['contribution_id']],
                    ['amount' => $contributionData['amount']]
                );
            }

            // PERA, LWOP-PERA, RATA,
            foreach ($employeeData['benefits'] as $benefitData) {
                $employee->benefits()->updateOrCreate(
                    ['benefit_id' => $benefitData['benefit_id']],
                    ['amount' => $benefitData['amount']]
                );
            }

            $employee->update([
                'total_salary' => $employeeData['total_salary'],
                'total_deductions' => $employeeData['total_deductions'],
                // 'net_amount' => $employeeData['net_amount'],
            ]);

            // Add employee data to the processed array
            $processedEmployees[] = [
                'id' => $employee->id,
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'monthly_salary' => $employeeData['monthly_salary'],
                'total_salary' => $employeeData['total_salary'],
                'net_pera' => $employeeData['net_pera'],
                'contributions' => $employeeData['contributions'],
                'benefits' => $employeeData['benefits'],
                'loans' => $employeeData['loans'],

                'total_contributions' => $employeeData['total_contributions'],
                'total_loans' => $employeeData['total_loans'],
                'total_deductions' => $employeeData['total_deductions'],
            ];
        }
    }

    // Generate a unique reference number
    $transaction = Transaction::create([
        'reference_number' => 'BSC-' . strtoupper(uniqid()),
        'data' => json_encode($processedEmployees),
    ]);

    return redirect()->route('payrollData')->with([
        'message' => 'Transaction saved successfully!',
        'reference_number' => $transaction->reference_number,
        'employees' => $processedEmployees,
    ]);
}





    public function show($referenceNumber)
    {
        $loanTypes = LoanType::all();
        $Benefits = Benefit::all();
        $contribution = Contribution::all();
        $transaction = Transaction::where('reference_number', $referenceNumber)->first();

        if (!$transaction) {
            abort(404, 'Transaction not found');
        }

        $data = json_decode($transaction->data, true);
        return Inertia::render('Payroll/FinalPayroll', [
            'transaction' => $transaction,
            'data' => $data,
            'loanTypes' => $loanTypes,
            'benefit' => $Benefits,
            'contribution' => $contribution,
        ]);
    }

}
