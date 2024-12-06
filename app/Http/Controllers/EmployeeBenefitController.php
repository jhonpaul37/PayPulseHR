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
public function bulkUpdate(Request $request)
{
    $request->validate([
        'changes' => 'required|array',
        'changes.*.employee_id' => 'required|exists:employees,id',
        'changes.*.benefit_id' => 'required|exists:benefits,id',
        'changes.*.amount' => 'required|numeric',
    ]);

    foreach ($request->changes as $change) {
        $employeeBenefit = EmployeeBenefit::where('employee_id', $change['employee_id'])
            ->where('benefit_id', $change['benefit_id'])
            ->first();

        if ($employeeBenefit) {
            $employeeBenefit->update(['amount' => $change['amount']]);
        } else {
            EmployeeBenefit::create([
                'employee_id' => $change['employee_id'],
                'benefit_id' => $change['benefit_id'],
                'amount' => $change['amount'],
            ]);
        }
    }

    return redirect()->back()->with('success', 'Benefits updated successfully!');
}



    public function store(Request $request)
    {
        $request->validate([
            'employee_ids' => 'required|array',
            'benefit_id' => 'required|exists:benefits,id',
            'amount' => 'required|numeric',
        ]);



        $existing = [];
        $created = [];

        foreach ($request->employee_ids as $employeeId) {
            $exists = EmployeeBenefit::where('employee_id', $employeeId)
                ->where('benefit_id', $request->benefit_id)
                ->exists();

            if ($exists) {
                $existing[] = $employeeId; // Track employees with existing benefits
            } else {
                EmployeeBenefit::create([
                    'employee_id' => $employeeId,
                    'benefit_id' => $request->benefit_id,
                    'amount' => $request->amount,
                ]);
                $created[] = $employeeId; // successfully created benefits
            }
        }

        return redirect()->back()->with([
            'success' => count($created) > 0 ? 'Benefit assigned successfully!' : null,
            'warning' => count($existing) > 0 ? 'Some employees already have this benefit.' : null,
        ]);
    }


}
