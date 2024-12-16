<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function unassignedUsers()
    {
        // Get all users who don't have an employee record
        $users = User::whereDoesntHave('employee')->get();

        // Return the data to the Inertia page
        return Inertia::render('Employees/UnassignedUsers', [
            'users' => $users,
        ]);
    }

    public function userData()
    {
        $user = Auth::user(); // authenticated user

        if ($user && $user->employee) {
            return response()->json([
                'user' => $user,
                'role' => $user->employee->role // user's role
            ]);
        }

        return response()->json($user);
    }

}
