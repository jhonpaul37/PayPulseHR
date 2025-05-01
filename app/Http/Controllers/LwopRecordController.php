<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LwopRecord;
use App\Models\EmployeeBenefit;
use App\Models\Benefit;

class LwopRecordController extends Controller
{
    public function storeLwopRecord(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'minutes' => 'required|integer|min:0',
            'hours' => 'nullable|integer|min:0|max:23',
            'days' => 'nullable|integer|min:0',
            'amount' => 'required|numeric|min:0',
        ]);

        // Calculate total minutes
        $totalMinutes = $request->minutes;
        if ($request->hours) {
            $totalMinutes += $request->hours * 60;
        }
        if ($request->days) {
            $totalMinutes += $request->days * 8 * 60; // Assuming 8-hour workday
        }

        // Store in lwop_records table
        $lwopRecord = LwopRecord::create([
            'employee_id' => $request->employee_id,
            'minutes' => $request->minutes,
            'hours' => $request->hours ?? 0,
            'days' => $request->days ?? 0,
            'amount' => $request->amount,
            'total_minutes' => $totalMinutes,
        ]);

        // Update the employee_benefits table
        $benefit = Benefit::where('name', 'LWOP-PERA')->first();

        if ($benefit) {
            EmployeeBenefit::updateOrCreate(
                [
                    'employee_id' => $request->employee_id,
                    'benefit_id' => $benefit->id
                ],
                [
                    'amount' => $request->amount
                ]
            );
        }

        return redirect()->back()->with('success', 'LWOP record saved successfully');
    }
}
