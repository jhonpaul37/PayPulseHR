<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Employee;
use App\Models\LoanType;
use App\Models\ProgramLoan;
use App\Models\LoanPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LoanController extends Controller
{

    public function Loans()
    {
        $loanTypes = LoanType::all();
        $loanPrograms = ProgramLoan::all();
        $loanPlans = LoanPlan::with('loanType')->get();
        return Inertia::render('Loans/Loans',['loanPrograms' => $loanPrograms, 'loanTypes' =>$loanTypes, 'loanPlans' => $loanPlans,]);
    }

}
