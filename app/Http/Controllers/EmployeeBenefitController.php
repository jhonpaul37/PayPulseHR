<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Benefit;
use App\Models\Payroll;
use App\Models\EmployeeBenefit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeBenefitController extends Controller
{
    public function index()
    {

        $employeeBenefits = EmployeeBenefit::with('employee', 'benefit')->get();
        $employees = Employee::all();
        $benefits = Benefit::all();

        return Inertia::render('Benefits/EmployeeBenefits', [
            'employees' => $employees,
            'benefits' => $benefits,
            'employeeBenefits' => $employeeBenefits,
        ]);
    }
public function updateLWOPPera(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'changes' => 'required|array',
        'changes.*.employee_id' => 'required|exists:employees,id',
        'changes.*.lwop_pera' => 'required|numeric',
    ]);

    // Get the updated LWOP-PERA values from the request
    $changes = $request->input('changes', []);

    // Find the LWOP-PERA benefit by its name
    $lwopBenefit = Benefit::where('name', 'LWOP-PERA')->first();

    if (!$lwopBenefit) {
        return response()->json(['message' => 'LWOP-PERA benefit not found.'], 404);
    }

    // Update the employee benefit records
    foreach ($changes as $change) {
        $employeeBenefit = EmployeeBenefit::where('employee_id', $change['employee_id'])
            ->where('benefit_id', $lwopBenefit->id)
            ->first();

        if ($employeeBenefit) {
            $employeeBenefit->update(['amount' => $change['lwop_pera']]);
        } else {
            EmployeeBenefit::create([
                'employee_id' => $change['employee_id'],
                'benefit_id' => $lwopBenefit->id,
                'amount' => $change['lwop_pera'],
            ]);
        }
    }

    return Inertia::render('BenefitsDashboard', [
        'message' => 'LWOP-PERA updated successfully!',
        'employeeBenefits' => EmployeeBenefit::with('benefit')->get(),
        'benefits' => Benefit::all(),
    ]);
}



    public function store(Request $request)
    {
        $request->validate([
            'employee_ids' => 'required|array',
            'benefit_id' => 'required|exists:benefits,id',
            'amount' => 'required|numeric',
        ]);

        foreach ($request->employee_ids as $employeeId) {
            EmployeeBenefit::create([
                'employee_id' => $employeeId,
                'benefit_id' => $request->benefit_id,
                'amount' => $request->amount,
            ]);
        }

        return redirect()->back()->with('success', 'Benefit assigned to employees successfully.');
    }

}
