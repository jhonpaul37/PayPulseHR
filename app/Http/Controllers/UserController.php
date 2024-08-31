<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function userData()
    {
        $user = Auth::user(); // Or auth()->user()
        return response()->json($user);
    }
    // public function index()
    // {
    //     $user = Auth::user();

    //     return Inertia::render('Dashboard', [
    //         'user' => [
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //         ],
    //     ]);
    // }
        public function index()
    {
        return Inertia::render('Dashboard'); // Adjust to your actual Inertia page component
    }

}
