<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class HomeController extends Controller
{
    public function landingPage()
    {
        $user = Auth::user(); // Get the authenticated user
        $today = now()->format('F j, Y'); // Current date in format like "December 5, 2024"

        return Inertia::render('Home/LandingPages', [
            'user' => $user,
            'date' => $today,
        ]);
    }

}
