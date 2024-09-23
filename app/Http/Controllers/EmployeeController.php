<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function EmployeeList()
    {
        $employees = Employee::all();
        return Inertia::render('Employees/EmployeeList', ['employees' => $employees]);
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

    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/EmployeeInfoEdit', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'birthdate' => 'required|date',
            'birthPlace' => 'nullable|string',
            'sex' => 'required|string',
            'civil_status' => 'required|string',
            'nationality' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
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

        // Check if a new photo was uploaded
        if ($request->hasFile('photo')) {
            // Store the new photo and save its path
            $path = $request->file('photo')->store('employee_photos', 'public');
            $validated['photo_url'] = $path;
        }

        // Update the employee with validated data
        $employee->update($validated);

        // Redirect to the employee list or another route
        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    public function create()
    {
        return Inertia::render('Employees/NewEmployee');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string',
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
            'password' => 'required|string|min:8',
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
            $validated['photo_url'] = $request->file('photo')->store('employee_photos', 'public');
        }

        // Create the user
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);


        $validated['user_id'] = $user->id;

        // Create the employee
        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

}