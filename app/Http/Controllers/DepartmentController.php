<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
{
    $departments = Department::all();
    return Inertia::render('Departments/Department', [
        'departments' => $departments,
    ]);
}

public function create()
{
    return Inertia::render('Departments/Create');
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    Department::create($validated);

    return redirect()->route('departments.index');
}

public function edit(Department $department)
{
    return Inertia::render('Departments/Edit', [
        'department' => $department,
    ]);
}

public function update(Request $request, Department $department)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    $department->update($validated);

    return redirect()->route('departments.index');
}

public function destroy(Department $department)
{
    $department->delete();
    return redirect()->route('departments.index');
}

}
