<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function EmployeeList()
    {
        $employees = Employee::all();
        return Inertia::render('Employees/EmployeeList', ['employees' => $employees]);
    }

    public function create()
    {
        return Inertia::render('Employees/NewEmployee');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'sex' => 'required|string',
            'civil_status' => 'required|string',
        ]);

        Employee::create($validated);
        return redirect()->route('employees.index');
    }

    public function EmployeeInfo(Employee $employee)
    {
        return Inertia::render('Employees/EmployeeInfo', ['employee' => $employee]);
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/Edit', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'sex' => 'required|string',
            // Other validation rules...
        ]);

        $employee->update($validated);
        return redirect()->route('employees.index');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->route('employees.index');
    }
}
