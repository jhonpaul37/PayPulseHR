<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function userData()
    {
        $user = Auth::user(); // Or auth()->user()
        return response()->json($user);
    }
}
