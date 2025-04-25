<?php

namespace App\Http\Controllers;

use App\Models\EmployeeLeaveCredit;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Leave;
use Illuminate\Container\Attributes\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class LeaveController extends Controller
{

    public function LeaveRequestForm()
    {
        $employee = Auth::user()->employee;
        return Inertia::render('Leave/LeaveRequestForm', ['employee' => $employee]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'requestor_name' => 'required|string',
            'employee_id' => 'required|integer',
            'office_unit' => 'required|string',
            'request_date' => 'required|date',
            'leave_type' => 'required|array',
            'other_leave_type' => 'nullable|string',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'total_days' => 'nullable|integer',
        ]);

        $leaveRequest = new Leave([
            'employee_id' => $request->input('employee_id'),
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

        return redirect()->route('my.loans')->with('success', 'Leave request submitted successfully.');
    }

    public function leaveManagement()
    {
        return Inertia::render('Leave/LeaveManagement');
    }

    public function leaveRequest()
    {
        $LeaveRequest = Leave::latest()->paginate(6);
        return Inertia::render('Leave/LeaveRequest',['LeaveRequest'=>$LeaveRequest]);
    }
    public function leaveCredit()
    {
        $employees = Employee::with([
            'position',
            'department',
            'salaryGrade',
            'leaveCredits'
        ])->get();

        return Inertia::render('Leave/LeaveCredit', ['employee' => $employees]);
    }

public function updateLeaveCredit(Request $request, Employee $employee)
{
    $validated = $request->validate([
        'vacation_leave' => 'required|numeric|min:0|max:365',
        'sick_leave' => 'required|numeric|min:0|max:365',
        'special_privilege_leave' => 'required|numeric|min:0|max:365',
    ]);

    $employee->leaveCredit()->updateOrCreate(
        ['employee_id' => $employee->id],
        $validated
    );

    return back()->with('success', 'Leave credits updated successfully');
}

    public function leaveRequestShow($id)
    {
        $LeaveRequest = Leave::findOrFail($id);
        return Inertia::render('Leave/LeaveRequestShow',['LeaveRequest'=>$LeaveRequest]);
    }

    public function AppLeaveForm($id)
    {
        $LeaveRequest = Leave::with('employee')->find($id);

        return Inertia::render('Leave/AppLeaveForm', [
            'LeaveRequest' => $LeaveRequest,
            'Employee' => $LeaveRequest->employee // Pass the employee data
        ]);
    }

}
