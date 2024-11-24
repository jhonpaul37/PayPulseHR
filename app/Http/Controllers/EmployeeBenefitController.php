<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Benefit;
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
