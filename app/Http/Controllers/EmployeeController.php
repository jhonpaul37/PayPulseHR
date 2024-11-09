<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use App\Models\SalaryGrade;
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
        $salaryGrades = SalaryGrade::all();
        return Inertia::render('Employees/EmployeeInfoEdit', ['employee' => $employee, 'salaryGrades' => $salaryGrades]);
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
            $path = $request->file('photo')->store('employee_photos', 'public');
            $validated['photo_url'] = $path;
        }

        // Update the employee with validated data
        $employee->update($validated);

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    public function create()
    {
        $salaryGrades = SalaryGrade::all();
        return Inertia::render('Employees/NewEmployee', [
            'salaryGrades' => $salaryGrades,
        ]);
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
            'salary_grade_id' => 'required|exists:salary_grades,id',
            'termination_date' => 'nullable|date',
            'termination_reason' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Photo validation
        if ($request->hasFile('photo')) {
            $validated['photo_url'] = $request->file('photo')->store('employee_photos', 'public');
        }

        // Users primary key must exist first before inserting a new Employee

        // Create the user first
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign the created user's ID to the Employee record
        $validated['user_id'] = $user->id;

        // Save the Employee with the `salary_grade_id` instead of `salary`
        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }


}
