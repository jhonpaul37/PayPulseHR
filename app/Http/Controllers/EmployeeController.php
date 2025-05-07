<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use App\Models\SalaryGrade;
use App\Models\EmployeeContribution;
use App\Models\Contribution;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function EmployeeList()
    {
        $employees = Employee::with(['position', 'department'])->get();
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
        return Inertia::render('Employees/EmployeeInfoEdit', [
            'department' => Department::all(),
            'positions' => Position::all(),
            'employee' => $employee,
            'salaryGrades' => $salaryGrades]);
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
        'position_id' => 'nullable|exists:positions,id',
        'department_id' => 'nullable|exists:departments,id',
        'start_date' => 'required|date',
        'employment_type' => 'required|string',
        'salary_grade_id' => 'required|exists:salary_grades,id',
        'vacation_days' => 'nullable|integer',
        'sick_days' => 'nullable|integer',
        'leave_balance' => 'nullable|integer',
        'termination_date' => 'nullable|date',
        'termination_reason' => 'nullable|string',
        'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'classification' => 'required|in:Regular,Casual,OJ/Job Order,COS/Contract of Service',
        'gsis_no' => 'nullable|string',
        'hdmf_no' => 'nullable|string',
        'phic_no' => 'nullable|string',
        'bir_tin_no' => 'nullable|string',
    ]);

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('employee_photos', 'public');
        $validated['photo_url'] = $path;
    }

    $employee->update($validated);

    $this->updateEmployeeContributions($employee);

    return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
}

private function updateEmployeeContributions(Employee $employee)
{
    $salaryGrade = $employee->salaryGrade;
    $monthlySalary = $salaryGrade ? $salaryGrade->monthly_salary : 0;

    // Contribution calculations
    $contributions = [
        'GSIS PREM' => $monthlySalary * 0.09,
        'HDMF PREM1' => $monthlySalary * 0.02,
        'PHIC' => $monthlySalary * 0.025,
    ];

    // Loop through contributions and update if they exist
    foreach ($contributions as $contributionName => $calculatedAmount) {
        // Find the corresponding contribution
        $contribution = Contribution::where('name', $contributionName)->first();

        if ($contribution) {
            // Check if employee has this contribution
            $employeeContribution = EmployeeContribution::where('employee_id', $employee->id)
                ->where('contribution_id', $contribution->id)
                ->first();

            if ($employeeContribution) {
                // Update the amount if contribution exists
                $employeeContribution->update(['amount' => $calculatedAmount]);
            }
        }
    }
}


    public function register($userId)
    {
        $user = User::findOrFail($userId);
        $salaryGrades = SalaryGrade::all();

        return Inertia::render('Employees/AddUnassignedUser', [
            'salaryGrades' => $salaryGrades,
            'user' => $user,
        ]);
    }

    public function storeNew(Request $request)
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
            'position_id' => 'required|exists:positions,id',
            'department_id' => 'required|exists:departments,id',
            'birthPlace' => 'required|string',
            'start_date' => 'required|date',
            'employment_type' => 'required|string',
            'salary_grade_id' => 'required|exists:salary_grades,id',
            'classification' => 'required|in:Regular,Casual,JO/Job Order,COS/Contract of Service',
            'gsis_no' => 'nullable|string',
            'hdmf_no' => 'nullable|string',
            'phic_no' => 'nullable|string',
            'bir_tin_no' => 'nullable|string',
            'termination_date' => 'nullable|date',
            'termination_reason' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_id' => 'required|exists:users,id',
            'email' => 'required|email|unique:employees,email',
        ]);

        // Photo validation
        if ($request->hasFile('photo')) {
            $validated['photo_url'] = $request->file('photo')->store('employee_photos', 'public');
        }

        $validated['user_id'] = $request->user_id;

        // Create employee with the user_id
        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    // HR will create the employee account
    public function create()
    {
        $salaryGrades = SalaryGrade::all();
        $department = Department::all();
        $positions = Position::all();
        return Inertia::render('Employees/NewEmployee', [
            'salaryGrades' => $salaryGrades,
            'positions' => $positions,
            'department' => $department,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'birthdate' => 'required|date',
            'birthPlace' => 'required|string',
            'sex' => 'required|string',
            'civil_status' => 'required|string',
            'nationality' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|unique:employees,email',
            'position_id' => 'nullable|exists:positions,id',
            'department_id' => 'nullable|exists:departments,id',
            'start_date' => 'required|date',
            'employment_type' => 'required|string',
            'salary_grade_id' => 'required|exists:salary_grades,id',
            'role' => 'nullable|in:employee,Accounting,Cashier,HR,SuperAdmin', // default 'employee'
            'termination_date' => 'nullable|date',
            'termination_reason' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Set default role to 'employee' if not provided
        $validated['role'] = $validated['role'] ?? 'employee';

        // Generate default password (LastName + BirthYear with first letter uppercase)
        $birthYear = date('Y', strtotime($validated['birthdate']));
        $lastName = ucfirst(strtolower($validated['last_name'])); // First letter uppercase
        $validated['password'] = $lastName . $birthYear;

        // Photo validation
        if ($request->hasFile('photo')) {
            $validated['photo_url'] = $request->file('photo')->store('employee_photos', 'public');
        }

        // Generate employee_id based on department_id
        if ($validated['department_id']) {
            $department = Department::find($validated['department_id']);
            $prefix = strtoupper(substr($department->name, 0, 1)); // First letter of department name
            $lastEmployee = Employee::where('department_id', $validated['department_id'])
                ->latest('employee_id') // Get the last employee created
                ->first();

            $lastEmployeeNumber = $lastEmployee ? (int) substr($lastEmployee->employee_id, 2) : 0;
            $newEmployeeNumber = str_pad($lastEmployeeNumber + 1, 3, '0', STR_PAD_LEFT);
            $validated['employee_id'] = $prefix . '-' . $newEmployeeNumber;
        }

        // Users primary key must exist first, before inserting a new Employee

        // Create user first
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // Save the hashed password
        ]);

        // Assign created user's ID to the Employee record
        $validated['user_id'] = $user->id;

        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

}
