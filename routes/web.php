<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FundClusterController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Routing
Route::middleware('auth')->group(function () {

    //Accounting
    Route::resource('/voucher',VoucherController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('autoIncrement', [VoucherController::class, 'getAutoIncrement']);
    Route::get('/fClusters', [FundClusterController::class, 'fCluster']);

    //HR

    //Leave
    Route::get('/leaveRequestForm', [LeaveController::class, 'LeaveRequestForm'])->name('leaveRequestForm');
    Route::post('/leaveRequestForm', [LeaveController::class, 'store'])->name('LeaveRequstForm.store');

    Route::get('/leaveRequest', [LeaveController::class, 'LeaveRequest'])->name('LeaveRequest');
    Route::get('/leaveRequest/show/{id}', [LeaveController::class, 'leaveRequestShow'])->name('LeaveRequest.show');
    //Application Leave Form
    Route::get('/appLeaveForm/{id}', [LeaveController::class, 'AppLeaveForm'])->name('Appleave');


    //Route::get('/appLeaveForm', [LeaveController::class, 'AppLeaveForm'])->name('Appleave'); seperate from with leave request


    //Employee
    Route::get('/employees', [EmployeeController::class, 'EmployeeList'])->name('employees.index');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('/employees/{employee}', [EmployeeController::class, 'EmployeeInfo'])->name('employees.show');
    Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');


    // Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');


    //Payroll
});

// for the User Profit
    Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
