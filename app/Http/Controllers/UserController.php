<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // public function userData()
    // {
    //     $user = Auth::user(); // Or auth()->user()
    //     return response()->json($user);
    // }

    public function userData()
    {
        $user = Auth::user(); // Get the authenticated user

        if ($user && $user->employee) {
            return response()->json([
                'user' => $user,
                'role' => $user->employee->role // Include the user's role
            ]);
        }

        return response()->json($user);
    }
}
