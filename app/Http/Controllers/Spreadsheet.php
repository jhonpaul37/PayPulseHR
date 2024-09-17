<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class spreadsheet extends Controller
{
    public function index()
    {
        $spreadsheet = Spreadsheet::first(); // Fetch the first spreadsheet data
        return Inertia::render('Spreadsheet', ['data' => $spreadsheet ? $spreadsheet->data : null]);
    }

    public function update(Request $request, Spreadsheet $spreadsheet)
    {
        $spreadsheet->update(['data' => $request->input('data')]);
        return back();
    }

}
