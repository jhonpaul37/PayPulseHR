<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use Inertia\Inertia;
class LeaveController extends Controller
{

    public function LeaveRequestForm()
    {
        return Inertia::render('Leave/LeaveRequestForm');
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

        return redirect()->route('leaveRequestForm')->with('success', 'Leave request submitted successfully.');
    }


    public function leaveRequest()
    {
        $LeaveRequest = Leave::latest()->paginate(5);
        return Inertia::render('Leave/LeaveRequest',['LeaveRequest'=>$LeaveRequest]);
    }
    public function leaveRequestShow($id)
    {
        $LeaveRequest = Leave::findOrFail($id);
        return Inertia::render('Leave/LeaveRequestShow',['LeaveRequest'=>$LeaveRequest]);
    }

    public function AppLeaveForm($id)
    {
        $LeaveRequest = Leave::find($id);
        // dd($LeaveRequest->leave_type);
        return Inertia::render('Leave/AppLeaveForm', ['LeaveRequest'=>$LeaveRequest]);
    }

}
