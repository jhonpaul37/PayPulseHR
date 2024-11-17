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
        'employee_id' => 'required|exists:employees,id',
        'benefit_id' => 'required|exists:benefits,id',
        'amount' => 'required|numeric',
    ]);

    EmployeeBenefit::create($request->all());

    return redirect()->route('employee_benefits.index');
}

}
