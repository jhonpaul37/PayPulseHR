<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use Inertia\Inertia;
class LeaveController extends Controller
{

    public function leave()
    {
        return Inertia::render('Leave/leave');
    }
    public function store(Request $request)
    {
        $request->validate([
            'requestor_name' => 'required|string',
            'office_unit' => 'required|string',
            'request_date' => 'required|date',
            'leave_type' => 'required|array',
            'other_leave_type' => 'nullable|string',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'total_days' => 'nullable|integer',
        ]);

        $leaveRequest = new Leave([
            'requestor_name' => $request->input('requestor_name'),
            'office_unit' => $request->input('office_unit'),
            'request_date' => $request->input('request_date'),
            'leave_type' => $request->input('leave_type'),
            'other_leave_type' => $request->input('other_leave_type'),
            'from_date' => $request->input('from_date'),
            'to_date' => $request->input('to_date'),
            'total_days' => $request->input('total_days'),
        ]);

        $leaveRequest->save();

        return redirect()->route('leave')->with('success', 'Leave request submitted successfully.');
    }

    public function AppLeaveForm()
    {

        return Inertia::render('Leave/appLeaveForm');
    }

}
