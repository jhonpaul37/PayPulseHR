<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contribution;

class ContributionController extends Controller
{
    public function index()
    {
        // Retrieve all contributions
        $contributions = Contribution::all();
        return inertia('Contribution/ContributionIndex', compact('contributions'));
    }

    public function create()
    {
        return inertia('Contribution/ContributionCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'nullable|numeric',
        ]);

        Contribution::create($request->all());
        return redirect()->route('contributions.index')->with('success', 'Contribution created successfully');
    }

    public function edit(Contribution $contribution)
    {
        return inertia('Contribution/ContributionEdit', compact('contribution'));
    }

    public function update(Request $request, Contribution $contribution)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'nullable|numeric',
        ]);

        $contribution->update($request->all());
        return redirect()->route('contributions.index')->with('success', 'Contribution updated successfully');
    }

    public function destroy(Contribution $contribution)
    {
        $contribution->delete();
        return redirect()->route('contributions.index')->with('success', 'Contribution deleted successfully');
    }
}
