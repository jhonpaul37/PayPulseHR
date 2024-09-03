<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use Inertia\Inertia;
class LeaveController extends Controller
{

    public function index()
    {
        return Inertia::render('Leave/Index');
    }

}
