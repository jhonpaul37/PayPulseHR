<?php

// app/Http/Controllers/SalaryGradeController.php

namespace App\Http\Controllers;

use App\Models\SalaryGrade;
use Illuminate\Http\Request;

class SalaryGradeController extends Controller
{
    public function index()
    {
        $salaryGrades = SalaryGrade::all();
        return inertia('SalaryGrade/SalaryGrade', [
            'salaryGrades' => $salaryGrades,
        ]);
    }

    public function check_and_add(Request $request)
    {
        $request->validate([
            'grade' => 'required|integer|unique:salary_grades,grade',
            'steps' => 'required|array|min:1',
            'steps.*.step' => 'required|integer',
            'steps.*.monthly_salary' => 'required|numeric|min:0',
        ]);

        // Create the salary grade and its steps
        foreach ($request->steps as $stepData) {
            SalaryGrade::create([
                'grade' => $request->grade,
                'step' => $stepData['step'],
                'monthly_salary' => $stepData['monthly_salary'],
            ]);
        }

        return redirect()->back()->with('success', 'Salary grade added successfully!');
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
