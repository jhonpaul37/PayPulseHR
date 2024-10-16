<?php

namespace App\Http\Controllers;

use App\Models\LoanPlan;
use App\Models\LoanType;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LoanPlanController extends Controller
{
    public function index()
    {
        $loanPlans = LoanPlan::with('loanType')->get();
        $loanTypes = LoanType::all();
        return Inertia::render('Loans/LoanPlans', [
            'loanPlans' => $loanPlans,
            'loanTypes' => $loanTypes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_type_id' => 'required|exists:loans_types,id',
            'months' => 'required|integer|min:1',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'penalty_rate' => 'required|numeric|min:0|max:100',
        ]);

        LoanPlan::create($request->all());
        return redirect()->back()->with('message', 'Loan plan added successfully.');
    }

    public function update(Request $request, $id)
    {
        $loanPlan = LoanPlan::findOrFail($id);

        $request->validate([
            'loan_type_id' => 'required|exists:loans_types,id',
            'months' => 'required|integer|min:1',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'penalty_rate' => 'required|numeric|min:0|max:100',
        ]);

        $loanPlan->update($request->all());
        return redirect()->back()->with('message', 'Loan plan updated successfully.');
    }
}
