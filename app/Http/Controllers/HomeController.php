<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class HomeController extends Controller
{
    public function landingPage()
    {
        $user = Auth::user();
        $today = now()->format('F j, Y');

        return Inertia::render('Home/LandingPages', [
            'user' => $user,
            'date' => $today,
        ]);
    }

}
