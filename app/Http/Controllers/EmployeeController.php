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
    public function terminate(Request $request, $id)
    {
        $request->validate([
            'termination_date' => 'required|date',
            'termination_reason' => 'required|string',
        ]);

        $employee = Employee::findOrFail($id);
        $employee->update([
            'termination_date' => $request->termination_date,
            'termination_reason' => $request->termination_reason,
        ]);

        return redirect()->route('employees.index', $id)->with('status', 'Employee terminated successfully');
    }

    public function terminatedEmployees()
    {
        return Inertia::render('Employees/Employee');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'birthdate' => 'required|date',
            'sex' => 'required|string',
            'civil_status' => 'required|string',
            'nationality' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|unique:employees,email',
            'position' => 'required|string',
            'department' => 'required|string',
            'start_date' => 'required|date',
            'employment_type' => 'required|string',
            'salary' => 'required|numeric',
            'vacation_days' => 'nullable|integer',
            'sick_days' => 'nullable|integer',
            'leave_balance' => 'nullable|integer',
            'termination_date' => 'nullable|date',
            'termination_reason' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('employee_photos', 'public');
            $validated['photo_url'] = $path;
        }

        Employee::create($validated);

        return redirect()->route('employees.index');
    }


    // public function EmployeeInfo(Employee $employee)
    // {
    //     return Inertia::render('Employees/EmployeeInfo', ['employee' => $employee]);
    // }

    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/EmployeeInfoEdit', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'company_id' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'birthdate' => 'required|date',
            'sex' => 'required|string',
            'civil_status' => 'required|string',
            'nationality' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|unique:employees,email',
            'position' => 'required|string',
            'department' => 'required|string',
            'start_date' => 'required|date',
            'employment_type' => 'required|string',
            'salary' => 'required|numeric',
            'vacation_days' => 'nullable|integer',
            'sick_days' => 'nullable|integer',
            'leave_balance' => 'nullable|integer',
            'termination_date' => 'nullable|date',
            'termination_reason' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('employee_photos', 'public');
            $validated['photo_url'] = $path;
        }

        $employee->update($validated);
        return redirect()->route('employees.index');
    }
}
