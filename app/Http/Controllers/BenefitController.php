<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class BenefitController extends Controller
{

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'amount' => 'required|numeric',
    ]);

    Benefit::create($request->all());

    return redirect()->route('employee_benefits.index');
}

}
