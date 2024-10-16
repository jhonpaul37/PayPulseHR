<?php

namespace App\Http\Controllers;

use App\Models\ProgramLoan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanProgramController extends Controller
{
    // public function index()
    // {
    //     return Inertia::render('Loans/LoanPrograms');
    // }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ProgramLoan::create([
            'name' => $request->name,
        ]);

        return redirect()->route('loans.view');
    }

    public function update(Request $request, $id)
    {
        $program = ProgramLoan::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $program->update([
            'name' => $request->name,
        ]);

        return redirect()->route('loans.view');
    }
}
