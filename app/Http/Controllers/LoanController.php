<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class LoanController extends Controller
{

    public function Loans(){
        return Inertia::render('Loans/Loans',);
    }
    public function calculateLoanPayment($loan)
    {
        $principal = $loan->principal;
        $interestRate = $loan->interest_rate / 100;
        $term = $loan->loan_term; // in months

        if ($loan->amortization_type === 'equal_payments') {
            // For equal monthly payments
            if ($loan->interest_type === 'fixed') {
                // Fixed interest formula
                $monthlyRate = $interestRate / 12;
                $monthlyPayment = ($principal * $monthlyRate) / (1 - pow(1 + $monthlyRate, -$term));
            } else {
                // Handle variable interest, e.g., based on an index
                // (simplify for now or base on historical data)
            }
        } else {
            // For declining balance amortization
            if ($loan->interest_type === 'fixed') {
                $monthlyPayment = $principal / $term; // Base monthly payment for principal
                // Interest is charged on the remaining principal
            } else {
                // Handle variable interest
            }
        }

        return response()->json(['monthlyPayment' => $monthlyPayment]);
    }
}
