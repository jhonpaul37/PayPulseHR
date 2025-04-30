<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\EmployeeLeaveCredit;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Leave;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class LeaveController extends Controller
{

    // By Employee
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

    //Apply for leave by HR
    public function LeaveRequestFormHR()
    {
        $employees = Employee::all();
        return Inertia::render('Leave/LeaveRequestFormHR', ['employees' => $employees]);
    }

    public function LeaveRequestHRstore(Request $request)
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

        return redirect()->route('leaveManagement')->with('success', 'Leave request submitted successfully.');
    }

    //
    public function leaveManagement()
    {
        return Inertia::render('Leave/LeaveManagement');
    }

    // Request

    public function leaveRequest()
    {
        $leaveRequests = Leave::whereNotIn('status', ['review', 'Approved'])
            ->latest()
            ->paginate(6);

        return Inertia::render('Leave/LeaveRequest', [
            'LeaveRequest' => $leaveRequests,
        ]);
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
        $data = $request->only([
            'vacation_leave',
            'sick_leave',
            'special_privilege_leave'
        ]);

        // Filter out null or empty values
        $data = array_filter($data, function($value) {
            return $value !== null && $value !== '';
        });

        $leaveCredit = $employee->leaveCredits;

        if ($leaveCredit) {
            // Add the new values to the existing ones
            foreach ($data as $key => $value) {
                $leaveCredit->$key += $value;
            }
            $leaveCredit->save();
        } else {
            // Create new record with the provided values
            $employee->leaveCredits()->create($data);
        }

        return back()->with('success', 'Leave credits added successfully');
    }

    //

    public function leaveStatus()
    {
        $approvedLeaves = Leave::where('status', 'Approved')
            ->with('employee')
            ->latest()
            ->paginate(6);

        return Inertia::render('Leave/LeaveStatus', [
            'LeaveRequest' => $approvedLeaves,
        ]);
    }


    //

    // public function forReview()
    // {
    //     $ReviewLeave = Leave::whereIn('status', ['review'])
    //         ->with('employee')
    //         ->latest()
    //         ->paginate(6);

    //     return Inertia::render('Leave/ForReview', [
    //         'ReviewLeave' => $ReviewLeave,
    //     ]);
    // }

    public function forReview()
{
    $ReviewLeave = Leave::whereIn('status', ['review'])
        ->with('employee')
        ->latest()
        ->paginate(6);

    return Inertia::render('Leave/ForReview', [
        'ReviewLeave' => $ReviewLeave,
    ]);
}

// public function updateStatus(Leave $leave, Request $request)
// {

//     $request->validate([
//         'status' => 'required|in:Approved,rejected,review',
//     ]);

//     $leave->update([
//         'status' => $request->status,
//     ]);

//     return back()->with('success', 'Leave status updated successfully');
// }

public function updateStatus(Leave $leave, Request $request)
{
    $request->validate([
        'status' => 'required|in:Approved,rejected,review',
    ]);

    DB::beginTransaction();
    try {
        $previousStatus = $leave->status;
        $leave->update(['status' => $request->status]);

        // Only deduct credits if changing to Approved and wasn't already approved
        if ($request->status === 'Approved' && $previousStatus !== 'Approved') {
            $user = $leave->user; // Assuming there's a user relationship

            // Determine which leave type to deduct from
            $leaveType = $leave->leave_type; // Adjust based on your structure

            // Example for vacation leave deduction
            if ($leaveType === 'Vacation') {
                $user->vacation_leave_balance -= $leave->total_days;
            }
            // Example for sick leave deduction
            elseif ($leaveType === 'Sick') {
                $user->sick_leave_balance -= $leave->total_days;
            }

            $user->save();
        }

        DB::commit();
        return back()->with('success', 'Leave status updated successfully');
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->with('error', 'Failed to update leave status: ' . $e->getMessage());
    }
}

    public function LeaveEdit(Leave $leave)
    {
        return Inertia::render('Leave/EditLeaveForm', [
            'leave' => $leave->load('employee'),
        ]);
    }

    public function leaveRequestShow($id)
    {
        $LeaveRequest = Leave::findOrFail($id);
        return Inertia::render('Leave/LeaveRequestShow',['LeaveRequest'=>$LeaveRequest]);
    }

    public function AppLeaveForm($id)
    {
        $leaveRequest = Leave::with([
            'employee.leaveCredits',
            'employee.salaryGrade',
            'employee.position',
            'employee.department',
        ])->findOrFail($id);

        return Inertia::render('Leave/AppLeaveForm', [
            'LeaveRequest' => [
                ...$leaveRequest->toArray(),
                'employee' => $leaveRequest->employee,
                'leave_credits' => $leaveRequest->employee->leaveCredits,
                'leave_type' => $leaveRequest->leave_type,
                'leave_details' => $leaveRequest->leave_details,
            ],
        ]);
    }
    // public function updateStatus(Leave $leave, Request $request)
    // {

    //     $leave->update([
    //         'status' => 'review',
    //     ]);

    //     return back()->with('success', 'Leave request status updated to review');
    // }
}
