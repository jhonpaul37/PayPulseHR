<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FundClusterController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\LoanController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Routing with Authentication
Route::middleware('auth')->group(function () {

    //Accounting
    Route::resource('/voucher',VoucherController::class);
    Route::get('/voucher/create',[VoucherController::class, 'create'])->name('voucher.add');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('autoIncrement', [VoucherController::class, 'getAutoIncrement']);
    Route::get('/fClusters', [FundClusterController::class, 'fCluster']);

    //HR
    //Leave Management
    Route::get('/leaveRequestForm', [LeaveController::class, 'LeaveRequestForm'])->name('leaveRequestForm');
    Route::post('/leaveRequestForm', [LeaveController::class, 'store'])->name('LeaveRequstForm.store');

    Route::get('/leaveRequest', [LeaveController::class, 'LeaveRequest'])->name('LeaveRequest');
    Route::get('/leaveRequest/show/{id}', [LeaveController::class, 'leaveRequestShow'])->name('LeaveRequest.show');
    Route::get('/appLeaveForm/{id}', [LeaveController::class, 'AppLeaveForm'])->name('Appleave');


    //Employee Records
    Route::get('/employees', [EmployeeController::class, 'EmployeeList'])->name('employees.index');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('/employees/{employee}', [EmployeeController::class, 'EmployeeInfo'])->name('employees.info');
    Route::post('/employees/{id}/terminate', [EmployeeController::class, 'terminate'])->name('employees.terminate');

    Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');

    //Payroll
    Route::get('/payroll/general', [PayrollController::class, 'generalPayroll'])->name('generalPayroll');

    Route::get('/payroll/data', [PayrollController::class, 'payrollData'])->name('payrollData');

    Route::get('/payroll/computation', [PayrollController::class, 'computation'])->name('computation');
    Route::get('/payroll', [PayrollController::class, 'payroll'])->name('payroll');

    Route::get('/loans', [LoanController::class, 'Loans'])->name('loans.view');
    Route::get('/loans/create', [LoanController::class, 'create'])->name('loans.create');
    Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');

});

// for the User Profit
    Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
