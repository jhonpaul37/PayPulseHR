<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class HomeController extends Controller
{
    public function landingPage()
    {
        $user = User::with('employee')->find(Auth::id());
        $today = now()->format('F j, Y');

        return Inertia::render('Home/LandingPages', [
            'auth' => [
                'user' => $user,
                'employee' => $user->employee,
            ],
            'user' => $user,
            'date' => $today,
        ]);
    }

}
