<?php

namespace App\Http\Controllers;

use App\Models\LoanType;
use App\Models\ProgramLoan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanTypeController extends Controller
{
    // public function index()
    // {
    //     $loanTypes = LoanType::all();
    //     $loanPrograms = ProgramLoan::all();
    //     return Inertia::render('Loans/LoanTypes', ['loanTypes' => $loanTypes, 'loanPrograms' => $loanPrograms]);
    // }

    public function create()
    {
        $loanPrograms = ProgramLoan::all();
        return Inertia::render('Loans/CreateLoanType',['loanPrograms' => $loanPrograms]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_program_id' => 'required|exists:programs_loans,id',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        LoanType::create($request->all());

        return redirect()->route('loans.view');
    }

    public function update(Request $request, LoanType $loanType)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $loanType->update($request->all());

        return redirect()->route('loans.view');
    }
}
