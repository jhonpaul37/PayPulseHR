<?php

// app/Http/Controllers/SalaryGradeController.php

namespace App\Http\Controllers;

use App\Models\SalaryGrade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SalaryGradeController extends Controller
{

public function uploadCSV(Request $request)
{
    $validator = Validator::make($request->all(), [
        'file' => 'required|mimes:csv,txt|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Invalid file format. Please upload a valid CSV file.'], 400);
    }

    $file = $request->file('file');
    $fileData = array_map('str_getcsv', file($file->getRealPath()));

    // Strip BOM from the header
    $header = array_map(fn($value) => trim(preg_replace('/\x{FEFF}/u', '', $value)), array_shift($fileData));

    $requiredHeaders = ['grade', 'step', 'monthly_salary'];

    if ($header !== $requiredHeaders) {
        return response()->json(['message' => 'Invalid CSV headers. Please include grade, step, and monthly_salary columns.'], 400);
    }

foreach ($fileData as $row) {
    $data = array_combine($header, $row);

    // Remove commas from monthly_salary
    $monthlySalary = str_replace(',', '', $data['monthly_salary']);

    // Ensure it's numeric
    if (!is_numeric($monthlySalary)) {
        return Inertia::render('YourComponentName', [
            'message' => 'Invalid salary format in CSV. Please make sure the monthly_salary is a valid number.',
        ]);
    }

    // Update or create salary grade
    SalaryGrade::updateOrCreate(
        ['grade' => $data['grade'], 'step' => $data['step']],
        ['monthly_salary' => $monthlySalary]
    );
}


    // Redirect or show a success message
    return redirect()->route('salary_grades.index') // Specify the route to redirect to
                    ->with('success', 'Salary grades updated successfully!');

}


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
