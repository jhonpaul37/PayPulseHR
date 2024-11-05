<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {

        // Log for debugging
        Log::info('Admin dashboard accessed', ['user' => $request->user()]);

        // Ensure you return roles as an array
        return Inertia::render('Dashboards', [
            'roles' => $request->user()->employee->roles ?? [], // Return roles as an array
        ]);
    }
}
