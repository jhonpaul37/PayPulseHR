<?php

// app/Http/Controllers/SalaryGradeController.php

namespace App\Http\Controllers;

use App\Models\SalaryGrade;
use Illuminate\Http\Request;

class SalaryGradeController extends Controller
{
    // Display all salary grades
    public function index()
    {
        $salaryGrades = SalaryGrade::all();
        return inertia('SalaryGrade/SalaryGrade', [
            'salaryGrades' => $salaryGrades,
        ]);
    }

    // Create a new salary grade
    public function create()
    {
        return inertia('SalaryGrade/SalaryGradeCreate');
    }

    // Store a new salary grade
    public function store(Request $request)
    {
        // Validate the input
        $request->validate([
            'grade' => 'required|integer',
            'step' => 'required|integer',
            'monthly_salary' => 'required|numeric',
        ]);

        // Create a new salary grade with only the validated data
        SalaryGrade::create([
            'grade' => $request->grade,
            'step' => $request->step,
            'monthly_salary' => $request->monthly_salary,
        ]);

        return redirect()->route('salary_grades.index');
    }

    // Edit an existing salary grade
    public function edit(SalaryGrade $salaryGrade)
    {
        return inertia('SalaryGrade/SalaryGradeEdit', [
            'salaryGrade' => $salaryGrade,
        ]);
    }

    // Update an existing salary grade
    public function update(Request $request, SalaryGrade $salaryGrade)
    {
        $request->validate([
            'grade' => 'required|integer',
            'step' => 'required|integer',
            'monthly_salary' => 'required|numeric',
        ]);

        $salaryGrade->update($request->all());

        return redirect()->route('salary_grades.index');
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'updatedGrades' => 'required|array',
            'updatedGrades.*.id' => 'required|exists:salary_grades,id',
            'updatedGrades.*.monthly_salary' => 'required|numeric',
        ]);

        foreach ($validated['updatedGrades'] as $grade) {
            SalaryGrade::where('id', $grade['id'])->update([
                'monthly_salary' => $grade['monthly_salary'],
            ]);
        }

        return redirect()->route('salary_grades.index')->with('success', 'Salaries updated successfully.');
    }

}
