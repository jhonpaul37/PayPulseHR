<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LoanController extends Controller
{

    public function Loans(){
        return Inertia::render('Loans/Loans',);
    }
    public function create()
    {
        $employees = Employee::all();
        return Inertia::render('Loans/CreateLoan', ['employees' => $employees]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'amount' => 'required|numeric',
            'loan_date' => 'required|date',
            'interest_rate' => 'required|numeric',
            'due_date' => 'required|date',
        ]);

        Loan::create($validated);

        return redirect()->route('loans.create')->with('success', 'Loan added successfully');
    }
}
