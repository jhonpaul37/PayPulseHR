<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function asignRoles()
    {
        $employee = Employee::all();

        return Inertia::render('Admin/Roles',['employees' => $employee,]);
    }

public function updateRoles(Request $request)
{
    $roles = $request->input('roles'); // Get the roles from the request

    foreach ($roles as $employeeId => $role) {
        $employee = Employee::find($employeeId); // Find employee by ID
        if ($employee) {
            $employee->role = $role; // Assign new role
            $employee->save(); // Save updated employee
        }
    }

    // Send success response back to the frontend
return redirect()->back()->with('success', 'Roles updated successfully');

}

}

