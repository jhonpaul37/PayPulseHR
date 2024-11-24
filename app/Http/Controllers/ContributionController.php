<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contribution;
use App\Models\EmployeeContribution;
use App\Models\Employee;

class ContributionController extends Controller
{
    public function index()
    {
        $contributions = Contribution::with(['employee'])->get();
        $employee = Employee::with(['salaryGrade'])->get();
        $employeeContribution = EmployeeContribution::with(['employee', 'contribution'])->get();

        return inertia('Contribution/ContributionIndex', [
            'contributions' => $contributions,
            'employees' => $employee,
            'employeeContribution' => $employeeContribution,
        ]);
    }

    public function create()
    {
        return inertia('Contribution/ContributionCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'contribution_id' => 'required|exists:contributions,id',
            'amount' => 'required|numeric',
        ]);

        EmployeeContribution::create([
            'employee_id' => $request->employee_id,
            'contribution_id' => $request->contribution_id,
            'amount' => $request->amount,
        ]);

        return redirect()->route('contributions.index')->with('success', 'Contribution created successfully');
    }


    public function edit(Contribution $contribution)
    {
        return inertia('Contribution/ContributionEdit', compact('contribution'));
    }

    // public function update(Request $request, $id)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //     ]);

    //     $contribution = Contribution::findOrFail($id);
    //     $contribution->update($request->all());

    //     return back()->with('success', 'Contribution updated successfully');
    // }
}
