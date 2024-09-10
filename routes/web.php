<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FundClusterController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/voucher',VoucherController::class);
    Route::get('autoIncrement', [VoucherController::class, 'getAutoIncrement']);
    Route::get('/fClusters', [FundClusterController::class, 'fCluster']);

    //HR
    Route::get('/leaveRequestForm', [LeaveController::class, 'LeaveRequestForm'])->name('leaveRequestForm');
    Route::post('/leaveRequestForm', [LeaveController::class, 'store'])->name('LeaveRequstForm.store');
    Route::get('/leaveRequest/show/{id}', [LeaveController::class, 'leaveRequestShow'])->name('showLeaveRequest.show');
    Route::get('/leaveRequest', [LeaveController::class, 'LeaveRequest'])->name('LeaveRequest');

    Route::get('/appLeaveForm', [LeaveController::class, 'AppLeaveForm'])->name('Appleave');

    //Payroll
});

// for the User Profit
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
